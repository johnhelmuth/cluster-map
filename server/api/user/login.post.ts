import {UserDataDocument} from "~/server/document-models/UserDataDocument";

export default defineEventHandler(async (event ) => {

  const body = await readBody(event);

  console.log('/user/login body: ', body);

  const loginResponse = UserDataDocument.login(body);
  return loginResponse;

})
