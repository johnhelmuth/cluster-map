import {UniverseDataDocument} from "~/server/document-models/UniverseDataDocument";

export default defineEventHandler((event ) => {
  return UniverseDataDocument.getUniversesMetadataData();
})
