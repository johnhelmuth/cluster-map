
import {isUniverseMetadataData} from "~/models/UniversesManager";
import {createSchemaValidationError, universeMetadataParse} from "~/utils/import-validator";
import { mongo } from '#nuxt-mongodb';

export async function getUniversesMetadataData() {
  const rawUniversesMetadataData = await mongo.db().collection("universes").find().toArray();

  const universesMetadataData = rawUniversesMetadataData
    .map((rawUniverseMetadataData) => {
      if (! isUniverseMetadataData(rawUniverseMetadataData)) {
        const parsedResponse = universeMetadataParse(rawUniverseMetadataData);
        throw createSchemaValidationError(parsedResponse, 'DataSourceDb, invalid universeMetadataData. ');
      }
      const { _id, ...universeMetadataData} = rawUniverseMetadataData;
      if (! rawUniverseMetadataData?.id && _id) {
        universeMetadataData.id = _id.toString();
      }
      return universeMetadataData;
    });

  console.log('universesMetadataData: ', universesMetadataData);

  return universesMetadataData;
}