import {UniverseDataDocument} from "~/server/document-models/UniverseDataDocument";

export default defineEventHandler(async (event ) => {
  const universeId = getRouterParam(event, 'universeId');
  console.log('universeId: ', universeId);
  if (universeId) {
    const universeData = await UniverseDataDocument.getUniverseData(universeId);
    console.log('universeData: ', universeData);
    return universeData;
  }
})