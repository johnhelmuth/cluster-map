import {UserDataDocument} from "~/server/document-models/UserDataDocument";

export default defineEventHandler(async (event ) => {
  await requireUserSession(event);

  const userId = getRouterParam(event, 'userId');

  if (userId) {
    const userData = await UserDataDocument.getUser(userId);
    return userData?.toUserMetadataData();
  }
})
