import {TokenDataDocument} from "~/server/document-models/TokenDataDocument";

/** This handler is just to help me track what's happening on the server, DO NOT COMMIT! **/
export default defineEventHandler(async (event ) => {
  const userId = getRouterParam(event, 'userId');
  console.log('token/[userId] userId', userId);

  let tokenType: 'verification' | 'reset';
  const queryParams = getQuery(event);
  if (queryParams
        && typeof queryParams === 'object'
        && Object.hasOwn(queryParams, 'token-type')
      ) {
    const rawTokenType = queryParams["token-type"];
    if (rawTokenType && typeof rawTokenType === "string") {
      if (! ['verification', 'reset'].includes(rawTokenType)) {
        throw createError({
          statusCode: 400,
          statusMessage: "Bad Request",
          message: "Invalid token type value",
          data: { field: "token-type" }
        })
      }
      tokenType = queryParams["token-type"] as 'verification' | 'reset';
    } else {
      tokenType = 'verification';
    }
  }

  if (typeof userId === 'string' && userId !== '') {
    const token = await TokenDataDocument.getTokenForUser(tokenType, userId);
    console.log('token/[userId] token', token)
    if (token) {
      const tokenModelData = token.toModelData();
      console.log('token/[userId] token.tokenModelData();', tokenModelData)
      return tokenModelData;
    }
  }

})
