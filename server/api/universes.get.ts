
import { universesData as universesData } from '~/server/data/universesData';
import type {UniverseMetadataIsLoadedType, UniverseMetadataType, UniversesMetadataDataType} from "~/types/ClusterTypes";

export default defineEventHandler(async (event) => {
   const logLabel = import.meta.client ? 'CLIENT: ' : 'SERVER: ';

   console.log(`${logLabel} api/universes universesData: `, universesData);

   const isLoaded = false;
   const universesMetaData = universesData.map(({ id, description }) => ({ id, description, isLoaded } as UniverseMetadataIsLoadedType));
   const currentUniverseId = universesMetaData[0].id;
   return {currentUniverseId, universesMetadata: universesMetaData} as UniversesMetadataDataType;
});