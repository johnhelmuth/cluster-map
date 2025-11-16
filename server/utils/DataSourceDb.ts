import {createSchemaValidationError, universeMetadataParse} from "~/utils/import-validator";
import {mongo} from '#nuxt-mongodb';
import * as mongoDB from 'mongodb';

import {UniverseDataDocument} from "~/server/document-models/UniverseDataDocument";
import {UserDataDocumentInterfaceInDB} from "~/server/document-models/UserDataDocument";
import {UserAuthDataDocumentInterface} from "~/server/document-models/UserAuthDataDocument";
import {TokenDataDocument} from "~/server/document-models/TokenDataDocument";
import {SCHEMA_VERSION} from "~/constants";

export const collections: {
  universes?: mongoDB.Collection<UniverseDataDocument>,
  tokens?: mongoDB.Collection<TokenDataDocument>,
  users?: mongoDB.Collection<UserDataDocumentInterfaceInDB>,
  usersAuth?: mongoDB.Collection<UserAuthDataDocumentInterface>
} = {};

function isCollectionKey(collName: string): collName is keyof typeof collections {
  return ['universes', 'tokens', 'users', 'usersAuth'].includes(collName);
}

export function collection(collName: string) {
  if (isCollectionKey(collName)) {
    if (!collections[collName]) {
      // @ts-ignore
      collections[collName] = mongo.db().collection(collName);
    }
    return collections[collName];
  }
}

export function universesCollection() {
  return collection("universes") as mongoDB.Collection<UniverseDataDocument>;
}

export function tokensCollection() {
  return collection("tokens") as mongoDB.Collection<TokenDataDocument>;
}

export function usersCollection() {
  return collection("users") as mongoDB.Collection<UserDataDocumentInterfaceInDB>;
}

export function usersAuthCollection() {
  return collection("usersAuth") as mongoDB.Collection<UserAuthDataDocumentInterface>;
}

export function initDocument(data: any, objectType: string) {
  if (! data?.schemaVersion) {
    data.schemaVersion = SCHEMA_VERSION;
  }
  if (! data?.type) {
    data.type = objectType;
  }
}