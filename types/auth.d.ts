import {UserMetadataData} from "~/server/document-models/UserDataDocument";

declare module '#auth-utils' {

  interface User extends UserMetadataData {

  }

  interface UserSession {
    // Add your own fields
  }

  interface SecureSessionData {
    // Add your own fields
  }
}

export {}