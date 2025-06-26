import {Document, ObjectId, WithId} from "mongodb";
import {SCHEMA_VERSION} from "~/constants";
import {UserIdType, UserModelData} from "~/models/UserModel";
import {usersAuthCollection, usersCollection} from "~/server/utils/DataSourceDb";
import {
  UserAuthDataDocument,
  UserAuthDataDocumentInterface,
  UserAuthDataDocumentZSchema, UserMetadataData
} from "~/server/document-models/UserAuthDataDocument";
import bcrypt from "bcryptjs";
import {isLoginDocument, LoginDocument} from "~/types/UserTypes";
import {z} from "zod";

export interface UserDataDocumentInterface extends WithId<Document> {
  schemaVersion: string;
  type: 'user';
  name: string;
  authenticationData: Array<UserAuthDataDocumentInterface>;
}

export function isUserDataDocumentInterface(data: any): data is UserDataDocumentInterface {
  const parseResponse = z.object({
    schemaVersion: z.literal(SCHEMA_VERSION),
    type: z.literal('user'),
    name: z.string(),
    authenticationData: z.array(UserAuthDataDocumentZSchema)
  }).safeParse(data);
  const isValid = data?._id && data?._id instanceof ObjectId &&
    parseResponse.success;
  return isValid;
}

export class UserDataDocument implements UserDataDocumentInterface {
  _id: ObjectId = new ObjectId();
  schemaVersion = SCHEMA_VERSION;
  type: 'user' = 'user';
  name: string = 'Unknown user';
  authenticationData: Array<UserAuthDataDocument> = [];

  constructor(data: any) {
    if (isUserDataDocumentInterface(data)) {
      this._id = data._id;
      this.schemaVersion = data.schemaVersion;
      this.type = data.type;
      this.name = data.name;
      if (data?.authenticationData
        && Array.isArray(data?.authenticationData)
        && data.authenticationData.every((authData) => {
          return UserAuthDataDocument.isUserAuthDataDocument(authData);
        })
      ) {
        const authenticationDataDocuments = data?.authenticationData
          .map((authData) => {
            return UserAuthDataDocument.create(authData);
          })
        this.authenticationData = authenticationDataDocuments;
      }
    }
  }

  static isUserDataDocument(data: any): data is UserDataDocument {
    return data instanceof UserDataDocument;
  }

  static create(data: any): UserDataDocument {
    return new UserDataDocument(data);
  }

  static async getUsersWhere(query: any) {
    const usersData = await usersCollection()
      .aggregate(UserDataDocument.dataPipeline(query)).toArray() as UserDataDocument[];
    if (usersData) {
      const userDataDocuments = usersData.map(
        (userData) => {
          const userDataDocument = UserDataDocument.create(userData);
          if (userDataDocument) {
            return userDataDocument;
          }
        }
      ).filter(udd => !!udd) as UserDataDocument[];
      return userDataDocuments;
    }
  }

  static async getUser(userId: UserIdType) {
    const query = {
      _id: {$eq: new ObjectId(userId)}
    }
    const userDataDocument = await UserDataDocument.getOneUserWhere(query);
    if (userDataDocument) {
      return userDataDocument;
    }
  }

  static async getOneUserWhere(query: any) {
    const usersDataDocuments = await UserDataDocument.getUsersWhere(query);
    if (usersDataDocuments && Array.isArray(usersDataDocuments) && usersDataDocuments.length > 0) {
      return usersDataDocuments[0];
    }
  }

  static async getUsersMetadata() {
    const usersDataDocuments = await UserDataDocument.getUsersWhere({})
    if (usersDataDocuments) {
      return usersDataDocuments.map(userDataDocument => userDataDocument.toUserMetadataData())
        .filter(umd => !!umd);
    }
  }

  static dataPipeline(query: any) {
    const matchQuery = query ? query : {};
    return [
      {
        $match: matchQuery
      },
      {
        $lookup: {
          from: "usersAuth",
          let: {
            authIds: "$authenticationData"
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ["$_id", "$$authIds"]
                }
              }
            }
          ],
          as: "authenticationData"
        }
      }
    ];
  }

  toModelData(): UserModelData {
    return {
      id: this._id.toHexString(),
      schemaVersion: this.schemaVersion,
      type: this.type,
      name: this.name,
      authenticationData: this.authenticationData.map(authData => {
        return authData.toModelData()
      })
    } as UserModelData;
  }

  toUserMetadataData(): UserMetadataData {
    return {
      id: this._id.toHexString(),
      name: this.name,
      authenticationData: this.authenticationData.map(authData => authData.toUserAuthMetadataData())
    }
  }

  static async login(data: LoginDocument | any) {
    if (isLoginDocument(data)) {
      const userAuth = await usersAuthCollection()
        .findOne({
          authType: 'username-password',
          'usernamePassword.username': data.username
        });
      console.log('UserDataDocument.login() userAuth: ', userAuth);
      if (userAuth?.usernamePassword) {
        const matches = await bcrypt.compare(data.password, userAuth.usernamePassword.hash);
        console.log('UserDataDocument.login() matches: ', matches);
        if (matches) {
          const userDataDocument = await UserDataDocument.getOneUserWhere({
            authenticationData: userAuth._id
          });
          console.log('UserDataDocument.login() userDataDocument: ', userDataDocument);
          if (userDataDocument) {
            return userDataDocument;
          }
          return {
            status: 500,
            message: "Problem loading user matching authentication credentials.",
          }
        } else {
          return {
            status: 403,
            message: "Invalid login credentials.",
          }
        }
      }
    }
    return {
      status: 400,
      message: "Bad request."
    }
  }

}
