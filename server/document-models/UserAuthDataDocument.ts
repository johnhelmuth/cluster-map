import type {AuthenticationDataInterface, AuthenticationTypeType, AuthIdType} from "~/models/UserModel";
import {Document, ObjectId, WithId} from "mongodb";
import {SCHEMA_VERSION} from "~/constants";


export interface UserAuthDataDocumentInterface extends WithId<Document>  {
  schemaVersion: string;
  type: 'user-auth-data';
  authType: AuthenticationTypeType;
  usernamePassword?: {
    username: string;
    hash: string;
  }
}

export class UserAuthDataDocument implements UserAuthDataDocumentInterface {
  _id: ObjectId = new ObjectId();
  schemaVersion = SCHEMA_VERSION;
  type: 'user-auth-data' = 'user-auth-data';
  authType: AuthenticationTypeType = 'username-password';
  usernamePassword?: {
    username: string;
    hash: string;
  }

  constructor(data: any) {
    if (UserAuthDataDocument.isUserAuthDataDocument(data)) {
      this._id = data._id;
      this.schemaVersion = SCHEMA_VERSION;
      this.type = data.type;
      this.authType = data.authType;
      if (data?.usernamePassword) {
        this.usernamePassword = data?.usernamePassword;
      }
    }
  }

  static create(data: any) {
    return new UserAuthDataDocument(data);
  }

  static isUserAuthDataDocument(data: any): data is UserAuthDataDocumentInterface {
    return true;
  }

  toModelData() {
    const modelData = {
      id: this._id.toHexString(),
      type: 'authentication-data',
      schemaVersion: this.schemaVersion,
      authType: this.authType
    } as AuthenticationDataInterface
    if (this.authType === 'username-password' && this?.usernamePassword) {
      modelData.usernamePassword = this.usernamePassword;
    }
    return modelData;
  }
}