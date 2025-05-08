
import {createSchemaValidationError, universeMetadataParse} from "~/utils/import-validator";
import {mongo} from '#nuxt-mongodb';
import * as mongoDB from 'mongodb';

import {UniverseDataDocument} from "~/server/document-models/UniverseDataDocument";
import {UserDataDocument} from "~/server/document-models/UserDataDocument";

export const collections: {
  universes?: mongoDB.Collection<UniverseDataDocument>,
  users?: mongoDB.Collection<UserDataDocument>,
} = {};

export function universesCollection(): mongoDB.Collection<UniverseDataDocument> {
  if (!collections?.universes) {
    collections.universes = mongo.db().collection('universes');
  }
  return collections.universes;
}

export function usersCollection(): mongoDB.Collection<UserDataDocument> {
  if (!collections?.users) {
    collections.users = mongo.db().collection('users');
  }
  return collections.users;
}