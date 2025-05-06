
import {createSchemaValidationError, universeMetadataParse} from "~/utils/import-validator";
import {mongo} from '#nuxt-mongodb';
import * as mongoDB from 'mongodb';

import {UniverseDataDocument} from "~/server/document-models/UniverseDataDocument";

export const collections: {
  universes?: mongoDB.Collection<UniverseDataDocument>,
} = {};

export function universesCollection(): mongoDB.Collection<UniverseDataDocument> {
  if (!collections?.universes) {
    collections.universes = mongo.db().collection('universes');
  }
  return collections.universes;
}