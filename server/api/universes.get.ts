
import { universesData as universesData } from '~/server/data/universesData';
import type {UniverseMetadataDataType, UniversesMetadataDataType} from "~/types/ClusterTypes";
import {UniverseModel} from "~/models/UniverseModel";

export default defineEventHandler(async (event) => {

  const universesMetadata = universesData.map(({ id, description }) => ({ id, description } as UniverseMetadataDataType));
  const universe = new UniverseModel(universesData[0]);
  const currentUniverseId = universe.id;
  return {currentUniverseId, universesMetadata, universe: universesData[0]} as UniversesMetadataDataType;
});