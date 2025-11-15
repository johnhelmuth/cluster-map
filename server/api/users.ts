import {UserDataDocument} from "~/server/document-models/UserDataDocument";

export default defineEventHandler(async (event ) => {
  const session = await requireUserSession(event);
  return UserDataDocument.getUsersMetadata();
})
