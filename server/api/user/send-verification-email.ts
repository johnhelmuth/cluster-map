
import {UserDataDocument, UserMetadataData} from "~/server/document-models/UserDataDocument";

export default defineEventHandler(async (event ) => {

  const session = await requireUserSession(event);

  const userMetadata = session.user as UserMetadataData;
  console.log('send-verification-email handler session: ', session);
  if (userMetadata.verifiedAt) {
    return {
      message: 'User is already verified, no need to send an email for verification.',
      sent: false
    }
  }

  const user = await UserDataDocument.getUser(userMetadata.id);

  if (user) {
    console.log('send-verification-email handler user: ', user);
    const emailService = useEmailService(event);
    const result = await emailService.sendVerificationEmail(user);
    console.log('send-verification-email handler result: ', result);
    return {
      message: 'User verification email was sent.',
      sent: !! result.accepted
    };
  }
})
