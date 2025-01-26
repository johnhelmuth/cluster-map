
import {getUniverseData} from "~/server/utils/paramUtils";

export default defineEventHandler(async (event) => {
    console.log('api/universe/[universeId] called.');
    const universeId = getRouterParam(event, 'universeId');
    const universe = await getUniverseData(universeId);
    if (! universe) {
        console.error('api/universe/[universeId] No universe found with that universeId.');
        throw createError({
            statusCode: 404,
            statusMessage: 'Universe not found',
        });
    }
    console.log('api/universe/[universeId] universe: ', universe);
    return universe;
});