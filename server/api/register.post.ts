
import {UserDataDocument} from "~/server/document-models/UserDataDocument";
import {parseRegisterBody, RegisterDocument} from "~/types/UserTypes";
import {ZodIssue} from "zod";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const bodyParsed = parseRegisterBody(body);
  const response = {
    status: 200,
    message: 'User created.',
  } as {
    status: number;
    message: string;
    errors?: ZodIssue[];
  }
  if (bodyParsed.success) {
    const registerData = bodyParsed.data as RegisterDocument;
    try {
      const userDataDocument = await UserDataDocument.newUser(registerData);
      if (! UserDataDocument.isUserDataDocument(userDataDocument)) {
        response.status = 500;
        response.message = 'Unknown Error, user not created?';
      }
    } catch (error: any) {
      console.error('register.post.ts caught error creating a new user: error: ', error);
      response.status = error?.status || 500;
      response.message = error?.message || 'Unknown error.';
    }
  } else {
    response.status = 400;
    response.message = 'Invalid registration information.';
    response.errors = bodyParsed.error.issues;
  }
  return response;
})
