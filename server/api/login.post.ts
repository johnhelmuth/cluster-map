
import {UserDataDocument} from "~/server/document-models/UserDataDocument";
import {parseLoginBody} from "~/types/UserTypes";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const bodyParsed = parseLoginBody(body);
  if (bodyParsed.success) {
    const userDataDocument = await UserDataDocument.login(body);
    if (UserDataDocument.isUserDataDocument(userDataDocument)) {
      // set the user session in the cookie
      // this server util is auto-imported by the auth-utils module
      await setUserSession(event, {
        user: userDataDocument.toUserMetadataData()
      })
      return {}
    }
  } else {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid credentials.'
    })
  }
  throw createError({
    statusCode: 401,
    statusMessage: 'Bad Credentials'
  })
})
