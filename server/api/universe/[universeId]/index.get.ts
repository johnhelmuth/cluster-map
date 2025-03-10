
import {getUniverseData, checkUniverseId, throwError, checkUniverseExists} from "~/server/utils/paramUtils";

export default defineEventHandler(async (event) => {
    console.log('api/universe/[universeId] called.');
    const universeId = getRouterParam(event, 'universeId');
    if (! checkUniverseId(universeId)) {
        return throwError(400, 'Bad request, no universeId.');
    }
    const universe = await getUniverseData(universeId);
    if (! checkUniverseExists(universe)) {
        return throwError(404, 'Universe not found');
    }
    console.log('api/universe/[universeId] universe: ', universe);
    return universe;
});