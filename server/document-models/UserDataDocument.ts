import {Document, ObjectId, WithId} from "mongodb";
import {SCHEMA_VERSION} from "~/constants";
import {type AuthenticationDataInterface, authenticationType, UserIdType, UserModelData} from "~/models/UserModel";
import {usersCollection} from "~/server/utils/DataSourceDb";

export interface UserDataDocumentInterface extends WithId<Document> {
  schemaVersion: string;
  type: 'user';
  name: string;
  authenticationData: Array<AuthenticationDataInterface>;
}

export interface UserMetadataData {
  id: UserIdType;
  name: string;
  authenticationData: Array<{
    authType: authenticationType;
  }>
}

export class UserDataDocument implements UserDataDocumentInterface {
  _id: ObjectId = new ObjectId();
  schemaVersion = SCHEMA_VERSION;
  type: 'user' = 'user';
  name: string = 'Unknown user';
  authenticationData: Array<AuthenticationDataInterface> = [];

  constructor(data: any) {
    if (UserDataDocument.isUserDataDocument(data)) {
      this._id = data._id;
      this.schemaVersion = data.schemaVersion;
      this.type = data.type;
      this.name = data.name;
      this.authenticationData = data.authenticationData;
    }
  }

  static isUserDataDocument(data: any): data is UserDataDocument {
    // TODO implement this
    return true;
  }

  static create(data: any): UserDataDocument {
    return new UserDataDocument(data);
  }

  static async getUser(userId: UserIdType) {
    const usersData = await (await usersCollection())
      .aggregate(UserDataDocument.dataPipeline(userId)).toArray() as UserDataDocument[];
    if (usersData) {
      const userDataDocument = UserDataDocument.create(usersData[0]);
      return userDataDocument.toModelData();
    }
  }

  static async getUsersMetadata() {
    const usersData = await (await usersCollection())
      .aggregate(UserDataDocument.dataPipeline()).toArray();
    if (usersData) {
      const userDataDocuments = usersData.map(userData => {
        const userDataDocument = UserDataDocument.create(userData);
        const userMetadataData = userDataDocument.toUserMetadataData()
        console.log('UserDataDocument.getUsersMetadata() userMetadataData: ', userMetadataData);
        return userMetadataData;
      })
      console.log('UserDataDocument.getUsersMetadata() userDataDocuments: ', userDataDocuments);
      return userDataDocuments;
    }
  }

  static dataPipeline(userId?: UserIdType) {
    const matchQuery = userId
      ? {
        _id: {$eq: new ObjectId(userId)}
      }
      : {};
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
      authenticationData: this.authenticationData
    } as UserModelData;
  }

  toUserMetadataData(): UserMetadataData {
    console.log('this.authenticationData', this.authenticationData);
    return {
      id: this._id.toHexString(),
      name: this.name,
      authenticationData: this.authenticationData.map(authData => {
        return { authType: authData.authType };
      })
    }
  }
}
