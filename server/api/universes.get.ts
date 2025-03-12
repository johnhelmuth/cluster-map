
import { universesData as universesData } from '~/server/data/universesData';
import type {UniverseMetadataIsLoadedType, UniverseMetadataType, UniversesMetadataDataType} from "~/types/ClusterTypes";
import {UniverseModel} from "~/models/UniverseModel";

export default defineEventHandler(async (event) => {
   const logLabel = import.meta.client ? 'CLIENT: ' : 'SERVER: ';

   console.log(`${logLabel} api/universes universesData: `, universesData);

   const isLoaded = false;
   const universesMetadata = universesData.map(({ id, description }) => ({ id, description, isLoaded } as UniverseMetadataIsLoadedType));
   const universe = new UniverseModel(universesData[0]);
   const currentUniverseId = universe.id;
   return {currentUniverseId, universesMetadata: universesMetadata, universe} as UniversesMetadataDataType;
});