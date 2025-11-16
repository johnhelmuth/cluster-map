import type {IdType} from "~/types/BasicTypes";
import type {UserIdType} from "~/models/UserModel";

export type TokenIdType = IdType;
export type TokenTypeType = 'verification' | 'reset';

export interface TokenModelData {
  id: TokenIdType;
  tokenType: TokenTypeType;
  token: string;
  expiry: Date;
  userId: UserIdType;
}

export class TokenModel implements TokenModelData {
  id: TokenIdType;
  tokenType: TokenTypeType;
  token: string;
  expiry: Date;
  userId: UserIdType = 'Unknown';


  constructor(data: any) {
    this.id = data.id;
    this.tokenType = data.tokenType;
    this.token = data.token;
    this.expiry = new Date(data.expiry);
    this.userId = data.userId;
  }

  getExpiry() {
    // if (! this._expiryDate) {
    //   this._expiryDate = new Date(this.expiry);
    // }
    // return this._expiryDate;
  }
  toJSON() {
    return {
      id: this.id,
      tokenType: this.tokenType,
      token: this.token,
      expiry: this.expiry,
      userId: this.userId,
    }
  }
}