import {UserDataDocument} from "~/server/document-models/UserDataDocument";

export default defineEventHandler((event ) => {
  return UserDataDocument.getUsersMetadata();
})
