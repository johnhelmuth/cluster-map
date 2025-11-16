import {Document, ObjectId, WithId} from "mongodb";
import {tokensCollection} from "~/server/utils/DataSourceDb";
import {UserIdType} from "~/models/UserModel";
import {z} from "zod";
import {DateTimeZSchema} from "~/server/document-models/UserDataDocument";
import {TokenModelData, TokenTypeType} from "~/models/TokenModel";

export interface TokenDataDocumentInterface extends WithId<Document> {
  tokenType: TokenTypeType;
  token: string;
  expiry: Date;
  userId: UserIdType;
}

export function isTokenDataDocumentInterface(data: any): data is TokenDataDocumentInterface {
  const parseResponse = z.object({
    tokenType: z.enum(["verification", "reset"]),
    token: z.string(),
    expiry: DateTimeZSchema,
    userId: z.string(),
  }).safeParse(data);
  return parseResponse.success;
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
      throw new Error('Invalid data supplied to TokenDataDocument constructor.');
    }
  }

  static async getTokenForUser(tokenType: TokenTypeType, userId: UserIdType) {
    const collection = tokensCollection();
    const tokenData = await collection
      .findOne({
        userId: new ObjectId(userId),
        tokenType
      });
    if (tokenData) {
      const tokenDataDocument = TokenDataDocument.create(tokenData);
      return tokenDataDocument;
    }
  }

  static create(data: any) {
    if (data.userId instanceof ObjectId) {
      data.userId = data.userId.toHexString();
    }
    if (data.expiry instanceof Date) {
      data.expiry = data.expiry.toISOString();
    }
    return new TokenDataDocument(data);
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