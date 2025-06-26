import {
  AuthenticationDataInterface,
  AuthenticationTypeType,
  AuthIdType,
  AUTHTYPE_USERNAME_PASSWORD
} from "~/models/UserModel";
import {Document, ObjectId, WithId} from "mongodb";
import {SCHEMA_VERSION} from "~/constants";
import {z} from "zod";


export const USER_AUTH_DATA_TYPE = 'user-auth';
export interface UserAuthDataDocumentInterface extends WithId<Document>  {
  schemaVersion: string;
  type: typeof USER_AUTH_DATA_TYPE;
  authType: AuthenticationTypeType;
  usernamePassword?: {
    username: string;
    hash: string;
  }
}

export const UserAuthDataDocumentZSchema = z.object({
  schemaVersion: z.literal(SCHEMA_VERSION),
  type: z.literal(USER_AUTH_DATA_TYPE),
  authType: z.literal(AUTHTYPE_USERNAME_PASSWORD),
  usernamePassword: z.object({
    username: z.string(),
    hash: z.string(),
  }).optional()
})

export interface UserAuthMetadataDocumentInterface extends WithId<Document>  {
  id: AuthIdType,
  authType: AuthenticationTypeType;
  username?: string;
}

export const UserAuthMetadataDocumentZSchema = z.object({
  authType: z.literal(AUTHTYPE_USERNAME_PASSWORD),
  username: z.string()
});



export class UserAuthDataDocument implements UserAuthDataDocumentInterface {
  _id: ObjectId = new ObjectId();
  schemaVersion = SCHEMA_VERSION;
  type: 'user-auth' = 'user-auth';
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
    return UserAuthDataDocumentZSchema.safeParse(data).success;
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

  toUserAuthMetadataData() {
    const modelData = {
      id: this._id.toHexString(),
      authType: this.authType,
    } as UserAuthMetadataDocumentInterface;
    if (this.authType === 'username-password' && this?.usernamePassword) {
      modelData.username = this.usernamePassword.username
    }
    return modelData;
  }
}