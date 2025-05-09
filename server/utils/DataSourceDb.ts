import {createSchemaValidationError, universeMetadataParse} from "~/utils/import-validator";
import {mongo} from '#nuxt-mongodb';
import * as mongoDB from 'mongodb';

import {UniverseDataDocument} from "~/server/document-models/UniverseDataDocument";
import {UserDataDocument} from "~/server/document-models/UserDataDocument";
import {UserAuthDataDocument} from "~/server/document-models/UserAuthDataDocument";

export const collections: {
  universes?: mongoDB.Collection<UniverseDataDocument>,
  users?: mongoDB.Collection<UserDataDocument>,
  usersAuth?: mongoDB.Collection<UserAuthDataDocument>,
} = {};

function isCollectionKey(collName: string): collName is keyof typeof collections {
  return ['universes', 'users', 'usersAuth'].includes(collName);
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

export function usersCollection() {
  return collection("users") as mongoDB.Collection<UserDataDocument>;
}

export function usersAuthCollection() {
  return collection("usersAuth") as mongoDB.Collection<UserAuthDataDocument>;
}