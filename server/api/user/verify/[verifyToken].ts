import {TOKEN_PATTERN} from "~/models/TokenModel";
import {TokenDataDocument} from "~/server/document-models/TokenDataDocument";
import {UserDataDocument, UserMetadataData} from "~/server/document-models/UserDataDocument";

export default defineEventHandler(async (event) => {
  const verifyToken = getRouterParam(event, 'verifyToken');
  let verifyResult = false;
  let message = 'Unknown error, email not verified.';
  let tokenUser: UserDataDocument | undefined = undefined;
  let thereIsALoggedInUser = false;
  let okToVerify = true;
  if (typeof verifyToken === 'string' && TOKEN_PATTERN.test(verifyToken)) {
    console.log('verifyToken api handler, verifyToken: ', verifyToken);
    const session = await getUserSession(event);
    let user: UserMetadataData | undefined = undefined;
    console.log('verifyToken api handler session: ', session);
    thereIsALoggedInUser = session && !!(session?.user);
    if (thereIsALoggedInUser) {
      console.log('verifyToken api handler session.user: ', session.user);
      user = session.user as UserMetadataData;
      tokenUser = await TokenDataDocument.getUserForToken(verifyToken, 'verification');
      console.log('verifyToken api handler, tokenUser: ', tokenUser);
      if (!tokenUser) {
        console.error('verifyToken api handler Couldn\'t find user matching supplied token.');
        message = 'Couldn\'t find user matching supplied token.'
        okToVerify = false;
      } else if (user.id !== tokenUser._id.toHexString()) {
        console.error('verifyToken api handler, logged in user and token user are different.');
        message = 'Logged in user and email verification token owner are different, email not verified.';
        okToVerify = false;
      } else if (user?.verifiedAt) {
        console.error('verifyToken api handler logged in user is already verified: ', user);
        message = 'Logged in user is already verified.';
        okToVerify = false;
      } else {
        console.log('verifyToken api handler logged in user is not current verified, OK to attempt verification.');
      }
    } else {
      console.log('verifyToken api handler there is no logged in user.');
    }
  } else {
    console.error('verifyToken api handler Invalid email verification token syntax.');
    message = 'Invalid email verification token syntax.';
    okToVerify = false;
  }

  if (okToVerify) {
    console.log('verifyToken api handler ok to verify.');
    verifyResult = await TokenDataDocument.verifyEmailToken(verifyToken!);
    if (verifyResult) {
      message = 'Email verified.';
      if (tokenUser) {
        console.log('verifyToken api handler refreshing session.');
        await setUserSession(event, {
          user: tokenUser.toUserMetadataData()
        })
      }
    } else {
      console.error('verifyToken api handler TokenDataDocument.verifyEmailToken() returned false.');
      message = 'Email not verified for some reason.'
    }
  } else {
    await Promise.resolve();
  }
  console.log('verifyToken api handler, verifyResult: ', verifyResult);
  console.log('verifyToken api handler, typeof verifyResult: ', typeof verifyResult);
  console.log('verifyToken api handler, message: ', message);
  console.log('verifyToken api handler, typeof message: ', typeof message);
  return {verifyResult, message};
})
