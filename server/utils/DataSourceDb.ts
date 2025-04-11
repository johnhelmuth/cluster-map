
import {isUniverseMetadataData} from "~/models/UniversesManager";
import {createSchemaValidationError, universeMetadataParse} from "~/utils/import-validator";
import { mongo } from '#nuxt-mongodb';

// export const db = mongo.db();
//
// export async function getUniversesMetadataData() {
//   const rawUniversesMetadataData = await db.collection("universes").find();
//   console.log('rawUniversesMetadataData: ', rawUniversesMetadataData);
//
//   const universesMetadataData = rawUniversesMetadataData
//     .map((rawUniverseMetadataData) => {
//       if (! isUniverseMetadataData(rawUniverseMetadataData)) {
//         const parsedResponse = universeMetadataParse(rawUniverseMetadataData);
//         throw createSchemaValidationError(parsedResponse, 'DataSourceDb, invalid universeMetadataData. ');
//       }
//       return rawUniverseMetadataData;
//     });
//
//   console.log('universesMetadataData: ', universesMetadataData);
//
//   return universesMetadataData;
// }