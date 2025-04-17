import {isUniverseMetadataData, UniverseMetadataData} from "~/models/UniversesManager";
import {createSchemaValidationError, universeMetadataParse} from "~/utils/import-validator";
import {mongo} from '#nuxt-mongodb';
import {ObjectId} from 'mongodb';

import {UniverseIdType, UniverseModelData} from "~/models/UniverseModel";
import {ClusterIdType} from "~/models/ClusterModel";
import {SystemIdType} from "~/models/SystemModel";

function mongoUniverseDataToUniverseMetadataData(universeData: any): UniverseMetadataData {
  return {
    id: universeData._id.toHexString(),
    type: 'universeMetadata',
    schemaVersion: universeData.schemaVersion.toString(),
    name: universeData.name
  }
}

export async function getUniversesMetadataData() {
  const universesMetadataCursor = await mongo.db().collection("universes").find();

  const rawUniversesMetadataData = [];

  for await (const universeData of universesMetadataCursor) {
    rawUniversesMetadataData.push(mongoUniverseDataToUniverseMetadataData(universeData))
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
  const universeData = await mongo.db().collection("universes")
    .findOne({
      _id: {$eq: new ObjectId(universeId)}
    });
  console.log('universeData: ', universeData);
  return universeData;
}

export async function getClustersData(clusterIds: Array<ClusterIdType>) {
  const clustersCursor = await mongo.db().collection("clusters")
    .find({
      // @ts-ignore
      _id: {$in: clusterIds}
    });
  return clustersCursor.toArray();
}

export async function getSystemsData(systemIds: Array<SystemIdType>) {
  const systemsCursor = await mongo.db().collection("systems")
  .find({
    // @ts-ignore
    _id: {$in: systemIds}
  });
  const systems = await systemsCursor.toArray();
  console.log('systems: ', systems);
  console.log('systems.length: ', systems.length);
  return systems;
}