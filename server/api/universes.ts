
import {universesMetadataData} from '~/server/utils/DataSource';

// Stub to get the client side code straightened out.  TODO Convert to use MongoDB once that is working.

export default defineEventHandler((event ) => {
  return universesMetadataData;
})
