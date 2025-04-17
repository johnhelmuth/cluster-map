import {getUniverseData} from "~/server/utils/DataSourceDb";

export default defineEventHandler(async (event ) => {
  const universeId = getRouterParam(event, 'universeId');
  console.log('universeId: ', universeId);
  if (universeId) {
    const universeData = await getUniverseData(universeId);
    console.log('universeData: ', universeData);
    return universeData;
  }
})