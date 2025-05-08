import type {IdType} from "~/types/BasicTypes";

export type UserIdType = IdType;
export type AuthIdType = IdType;

export type authenticationType = 'username-password';

export interface AuthenticationDataInterface {
  id: AuthIdType;
  schemaVersion: string;
  type: 'authentication-data';
  authType: authenticationType;
  usernamePassword?: {
    username: string;
    salt: string;
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