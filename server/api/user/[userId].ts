import {UserDataDocument} from "~/server/document-models/UserDataDocument";

export default defineEventHandler(async (event ) => {
  const userId = getRouterParam(event, 'userId');
  console.log('userId: ', userId);
  if (userId) {
    const userData = await UserDataDocument.getUser(userId);
    console.log('userData: ', userData);
    return userData;
  }
})
