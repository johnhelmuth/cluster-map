import {UniverseDataDocument} from "~/server/document-models/UniverseDataDocument";

export default defineEventHandler(async (event ) => {
  const universeId = getRouterParam(event, 'universeId');
  if (universeId) {
    return await UniverseDataDocument.getUniverseData(universeId);
  }
})