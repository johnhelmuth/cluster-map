import type {IdType} from "~/types/BasicTypes";

export type UserIdType = IdType;
export type AuthIdType = IdType;

export type AuthenticationTypeType = 'username-password';

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