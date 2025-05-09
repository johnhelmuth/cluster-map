import {Document, ObjectId, WithId} from "mongodb";
import {SCHEMA_VERSION} from "~/constants";
import {AuthenticationTypeType, UserIdType, UserModelData} from "~/models/UserModel";
import {usersAuthCollection, usersCollection} from "~/server/utils/DataSourceDb";
import {
  UserAuthDataDocument,
  UserAuthDataDocumentInterface
} from "~/server/document-models/UserAuthDataDocument";
import bcrypt from "bcryptjs";

export interface UserDataDocumentInterface extends WithId<Document> {
  schemaVersion: string;
  type: 'user';
  name: string;
  authenticationData: Array<UserAuthDataDocumentInterface>;
}

export interface UserMetadataData {
  id: UserIdType;
  name: string;
  authenticationData: Array<{
    authType: AuthenticationTypeType;
  }>
}

export class UserDataDocument implements UserDataDocumentInterface {
  _id: ObjectId = new ObjectId();
  schemaVersion = SCHEMA_VERSION;
  type: 'user' = 'user';
  name: string = 'Unknown user';
  authenticationData: Array<UserAuthDataDocument> = [];

  constructor(data: any) {
    if (UserDataDocument.isUserDataDocument(data)) {
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
    // TODO implement this
    return true;
  }

  static create(data: any): UserDataDocument {
    return new UserDataDocument(data);
  }

  static async getUsersWhere(query: any, asModelData = true) {
    const usersData = await usersCollection()
      .aggregate(UserDataDocument.dataPipeline(query)).toArray() as UserDataDocument[];
    if (usersData) {
      const usersModelData = usersData.map(
        (userData) => {
          const userDataDocument = UserDataDocument.create(userData);
          if (userDataDocument) {
            return asModelData ? userDataDocument.toModelData() : userDataDocument;
          }
        }
      ).filter(umd => !! umd);
      return usersModelData;
    }
  }

  static async getUser(userId: UserIdType) {
    const query = {
      _id: {$eq: new ObjectId(userId)}
    }
    const userModelData = await UserDataDocument.getOneUserWhere(query);
    if (userModelData) {
      return userModelData;
    }
  }

  static async getOneUserWhere(query: any) {
    const usersModelData = await UserDataDocument.getUsersWhere(query);
    if (usersModelData && Array.isArray(usersModelData) && usersModelData.length > 0) {
      return usersModelData[0];
    }
  }

  static async getUsersMetadata() {
    const usersData = await usersCollection()
      .aggregate(UserDataDocument.dataPipeline({})).toArray();
    if (usersData) {
      const userDataDocuments = usersData.map(userData => {
        const userDataDocument = UserDataDocument.create(userData);
        const userMetadataData = userDataDocument.toUserMetadataData()
        return userMetadataData;
      })
      return userDataDocuments;
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
          from: "usersAuthData",
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
      authenticationData: this.authenticationData.map(authData => {
        return {authType: authData.authType};
      })
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
          return true;
        }
      }
    }
    return false;
  }
}

export type LoginDocument = { username: string, password: string };

function isLoginDocument(data: any): data is LoginDocument {
  return (
    data &&
    data?.username && typeof data?.username === 'string' &&
    data?.password && typeof data?.password === 'string'
  );
}
