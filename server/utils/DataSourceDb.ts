import {isUniverseMetadataData} from "~/models/UniversesManager";
import {createSchemaValidationError, universeMetadataParse} from "~/utils/import-validator";
import {mongo} from '#nuxt-mongodb';
import * as mongoDB from 'mongodb';

import { UniverseIdType } from "~/models/UniverseModel";
import {
  UniverseDataDocumentToUniverseMetadataData,
  UniverseDataDocumentToUniverseModelData,
  UniverseDataDocument, universeDataPipeline
} from "~/server/document-models/UniverseDataDocument";
import { ClusterDataDocument } from "~/server/document-models/ClusterDataDocument";
import { SystemDataDocument } from "~/server/document-models/SystemDataDocument";

export const collections: {
  universes?: mongoDB.Collection<UniverseDataDocument>,
  clusters?: mongoDB.Collection<ClusterDataDocument>,
  systems?: mongoDB.Collection<SystemDataDocument>,
} = {};

export function universesCollection() : mongoDB.Collection<UniverseDataDocument> {
  if (! collections?.universes) {
    collections.universes = mongo.db().collection('universes');
    // TODO Add schema validation here
  }
  return collections.universes;
}

export function clustersCollection() : mongoDB.Collection<ClusterDataDocument> {
  if (! collections?.clusters) {
    collections.clusters = mongo.db().collection('clusters');
    // TODO Add schema validation here
  }
  return collections.clusters;
}

export function systemsCollection() : mongoDB.Collection<SystemDataDocument> {
  if (! collections?.systems) {
    collections.systems = mongo.db().collection('systems');

  }
  return collections.systems;
}

export async function getUniversesMetadataData() {
  const universesMetadataCursor = universesCollection().find();

  const rawUniversesMetadataData = [];

  for await (const universeData of universesMetadataCursor) {
    rawUniversesMetadataData.push(UniverseDataDocumentToUniverseMetadataData(universeData))
  }
  const universesMetadataData = rawUniversesMetadataData
    .map((rawUniverseMetadataData) => {
      if (!isUniverseMetadataData(rawUniverseMetadataData)) {
        const parsedResponse = universeMetadataParse(rawUniverseMetadataData);
        throw createSchemaValidationError(parsedResponse, 'DataSourceDb, invalid universeMetadataData. ');
      }
      return rawUniverseMetadataData;
    });
  return universesMetadataData;
}

export async function getUniverseData(universeId: UniverseIdType) {
  const universesData = await universesCollection()
    .aggregate(universeDataPipeline(universeId)).toArray() as UniverseDataDocument[];
  if (universesData) {
    return UniverseDataDocumentToUniverseModelData(universesData[0]);
  }
}