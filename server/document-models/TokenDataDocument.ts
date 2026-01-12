import {Document, ObjectId, WithId} from "mongodb";
import {tokensCollection} from "~/server/utils/DataSourceDb";
import {UserIdType} from "~/models/UserModel";
import {nanoid} from "nanoid";
import {z} from "zod";
import {DateTimeZSchema, UserDataDocument} from "~/server/document-models/UserDataDocument";
import {TokenTypeType, TOKEN_PATTERN} from "~/models/TokenModel";

export const TOKEN_EXPIRATION_PERIOD = 3 * 60 * 60 * 1000; // 3 Hours in milliseconds

export interface TokenDataDocumentInterfaceBase extends WithId<Document> {
  tokenType: TokenTypeType;
  token: string;
  expiry: Date;
}

export interface TokenDataDocumentInterfaceInDb extends TokenDataDocumentInterfaceBase {
  userId: ObjectId;
}

export interface TokenDataDocumentInterface extends TokenDataDocumentInterfaceBase {
  userId: UserIdType;
}

export function isTokenDataDocumentInterface(data: any): data is TokenDataDocumentInterface {
  const parseResponse = parseTokenDataDocumentInterfaceErrors(data);
  return parseResponse.success;
}

export function parseTokenDataDocumentInterfaceErrors(data: any) {
  return z.object({
    tokenType: z.enum(["verification", "reset"]),
    token: z.string().regex(TOKEN_PATTERN),
    expiry: DateTimeZSchema,
    userId: z.string(),
  }).safeParse(data)
}

export class TokenDataDocument implements TokenDataDocumentInterface {
  _id: ObjectId = new ObjectId();
  tokenType: TokenTypeType = 'verification';
  token: string = '';
  expiry: Date = new Date();
  userId: UserIdType;

  constructor(data: any) {
    if (isTokenDataDocumentInterface(data)) {
      if (data._id) {
        this._id = data._id;
      }
      this.tokenType = data.tokenType;
      this.token = data.token;
      if (typeof data.expiry === "string") {
        this.expiry = new Date(data.expiry);
      } else if (data.expiry instanceof Date) {
        this.expiry = data.expiry;
      } else {
        throw new Error("Invalid expiry date supplied to TokenDataDocument constructor.")
      }
      if (typeof data.userId === 'string') {
        this.userId = data.userId;
      } else {
        throw new Error('Invalid token userId supplied to TokenDataDocument constructor.')
      }
    } else {
      console.error('TokenDataDocument.constructor() Invalid data errors: ', parseTokenDataDocumentInterfaceErrors(data));
      throw new Error('Invalid data supplied to TokenDataDocument constructor.');
    }
  }

  static newExpireDate() {
    const nowTS = Date.now();
    const nowDate = new Date(nowTS);
    const expiryTS = nowTS + TOKEN_EXPIRATION_PERIOD;
    const expiryDate = new Date(expiryTS);
    console.log('TokenDataDocument.newExpireDate()      nowTS', nowTS);
    console.log('TokenDataDocument.newExpireDate()   expiryTS', expiryTS);
    console.log('TokenDataDocument.newExpireDate()    nowDate', nowDate);
    console.log('TokenDataDocument.newExpireDate() expiryDate', expiryDate);
    return expiryDate;
  }

  static newTokenString(tokenType: TokenTypeType) {
    return nanoid();
  }

  static async getUserForToken(token: string, tokenType: TokenTypeType) {
    if (token) {
      const tokenData = await tokensCollection().findOne({
        token,
        tokenType: 'verification',
      });
      if (tokenData) {
        return this.getUserFromToken(tokenData);
      }
    }
  }

  static async getUserFromToken(token: TokenDataDocumentInterface|TokenDataDocumentInterfaceInDb) {
    if (token) {
      console.log('TokenDataDocument.getUserFromToken() token: ', token);
      let userId = token.userId as (ObjectId | UserIdType);
      if (userId && typeof userId !== 'string') {
        userId = userId.toHexString()
      }
      const tokenUser = await UserDataDocument.getUser(userId)
      console.log('TokenDataDocument.getUserFromToken() tokenUser: ', tokenUser);
      return tokenUser;
    }

  }

  static async verifyEmailToken(token: string) {
    if (token) {
      const tokenData = await tokensCollection().findOne({
        token,
        tokenType: 'verification',
      });
      if (tokenData) {
        const verifyUser = await this.getUserFromToken(tokenData);
        console.log('TokenDataDocument.verifyEmailToken() verifyUser: ', verifyUser);
        if (verifyUser) {
          await verifyUser.setVerified();
          await tokensCollection().deleteOne({ "_id": tokenData._id });
          return true;
        }
      }
    }
    return false;
  }

  static async createNewTokenForUser(userId: UserIdType, tokenType: TokenTypeType) {
    let token = await this.getTokenForUser(userId, tokenType);
    if (token) {
      console.log('TokenDataDocument.createNewTokenForUser() token for user from database: ', token);
      token.expiry = this.newExpireDate();
      token.token = this.newTokenString(tokenType)
      const updateDoc = {
        $set: {
          expiry: token.expiry,
          token: token.token
        }
      };
      console.log('TokenDataDocument.createNewTokenForUser() updateDoc: ', updateDoc);
      const result = await tokensCollection()
        .updateOne(
          { _id: token._id },
          updateDoc
        );
      console.log('TokenDataDocument.createNewTokenForUser() result of update: ', result);
      return token;
    } else {
      const doc = {
        userId,
        tokenType,
        expiry:
          this.newExpireDate(),
        token:
          this.newTokenString(tokenType)
      };
      const tokenDataDocument = new TokenDataDocument(this.fromDBData(doc));
      await tokenDataDocument.save();
      console.log('TokenDataDocument.createNewTokenForUser() new tokenDataDocument: ', tokenDataDocument);
      return tokenDataDocument;
    }
  }

  static async getTokenForUser(userId: UserIdType, tokenType: TokenTypeType) {
    const tokenData = await tokensCollection().findOne({ userId: new ObjectId(userId), tokenType })
    console.log('TokenDataDocument.getTokenForUser() tokenData: ', tokenData);
    if (tokenData) {
      const token = new TokenDataDocument(this.fromDBData(tokenData))
      console.log('TokenDataDocument.getTokenForUser() token: ', token);
      return token;
    }
  }

  static create(data: any) {
    return new TokenDataDocument(this.fromDBData(data));
  }

  static fromDBData(data: any) {
    if (data.userId instanceof ObjectId) {
      data.userId = data.userId.toHexString();
    }
    if (data.expiry instanceof Date) {
      data.expiry = data.expiry.toISOString();
    }
    return data;
  }

  toDBData() {
    return {
      _id: this._id,
      tokenType: this.tokenType,
      token: this.token,
      expiry: this.expiry,
      userId: new ObjectId(this.userId)
    };
  }

  async save() {
    return tokensCollection().insertOne(this.toDBData());
  }

  toModelData() {
    return {
      id: this._id.toHexString(),
      tokenType: this.tokenType,
      token: this.token,
      expiry: this.expiry.toISOString(),
      userId: this.userId
    };
  }
}