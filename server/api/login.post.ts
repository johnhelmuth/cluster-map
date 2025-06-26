
import {UserDataDocument, validateLoginBody} from "~/server/document-models/UserDataDocument";

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, validateLoginBody)

  const userDataDocument = await UserDataDocument.login(body);
  if (userDataDocument) {
    // set the user session in the cookie
    // this server util is auto-imported by the auth-utils module
    await setUserSession(event, {
      user: userDataDocument.toUserMetadataData()
    })
    return {}
  }
  throw createError({
    statusCode: 401,
    message: 'Bad credentials'
  })
})
