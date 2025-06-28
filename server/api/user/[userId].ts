import {UserDataDocument} from "~/server/document-models/UserDataDocument";

export default defineEventHandler(async (event ) => {
  const session = await requireUserSession(event);
  const userId = getRouterParam(event, 'userId');
  if (userId && session?.id && userId === session?.user?.id) {
    const userData = await UserDataDocument.getUser(userId);
    return userData?.toUserMetadataData();
  }
  throw createError({ status: 403, statusText: 'Unauthorized' });
})
