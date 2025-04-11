/**
 * /api/id-gen
 *
 * Generates an ObjectId() for a new object.
 *
 * Implemented as a server-side api call so I don't have to worry about getting the nodejs `bson`
 * library running in the browser.
 *
 * Will remove this completely when I implement the database backend, and will just use the create api call to
 * set the new ID.
 */
import { ObjectId } from 'bson';

export default defineEventHandler((event ) => {
  return new ObjectId().toHexString();
})
