import {universesData} from "~/server/utils/DataSource";
import { universeParse } from "~/utils/import-validator";
import {isUniverseModelData} from "~/models/UniverseModel";

export default defineEventHandler((event ) => {
  const universeId = getRouterParam(event, 'universeId');
  const matchedUniversesData = universesData.filter((universe) => universe.id === universeId);
  if (matchedUniversesData.length > 0) {
    const universeData = matchedUniversesData[0];
    if (isUniverseModelData(universeData)) {
      return universeData;
    }
  }
})