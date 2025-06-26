import type {IdType} from "~/types/BasicTypes";

export type UserIdType = IdType;
export type AuthIdType = IdType;

export const AUTHTYPE_USERNAME_PASSWORD = 'username-password';
export type AuthenticationTypeType = typeof AUTHTYPE_USERNAME_PASSWORD;

export interface AuthenticationDataInterface {
  id: AuthIdType;
  schemaVersion: string;
  type: 'authentication-data';
  authType: AuthenticationTypeType;
  usernamePassword?: {
    username: string;
    hash: string;
  }
}

export interface UserModelData {
  id: UserIdType;
  schemaVersion: string;
  type: 'user';
  name: string;
  authenticationData: Array<AuthenticationDataInterface>;
}

export interface AuthenticationMetadataDataInterface {
  id: AuthIdType;
  authType: AuthenticationTypeType;
  username?: string;
}

export interface UserMetadataModel {
  id: UserIdType;
  name: string;
  authenticationData: Array<AuthenticationMetadataDataInterface>
}