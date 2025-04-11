
import {universesMetadataData} from '~/server/utils/DataSource';
// import { getUniversesMetadataData} from "~/server/utils/DataSourceDb";

// Stub to get the client side code straightened out.  TODO Convert to use MongoDB once that is working.

export default defineEventHandler((event ) => {
  return universesMetadataData;
  // return getUniversesMetadataData();
})
