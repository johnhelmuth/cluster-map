
import { universesData as universesData } from '~/server/data/universesData'

export default defineEventHandler(async (event) => {

   const logLabel = import.meta.client ? 'CLIENT: ' : 'SERVER: ';
   console.log(`${logLabel} api/universes universesData: `, universesData);
   const universesMetaData = universesData.map(({ id, description }) => ({ id, description }));
   const currentUniverseId = universesMetaData[0].id;
   return {currentUniverseId, universesMetaData};
});