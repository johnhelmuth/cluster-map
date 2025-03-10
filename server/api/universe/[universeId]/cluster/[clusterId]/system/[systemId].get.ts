
import {
    checkClusterId,
    checkSystemExists,
    checkSystemId,
    checkUniverseId,
    getSystemData,
    throwError
} from "~/server/utils/paramUtils";

export default defineEventHandler(async (event) => {
    const universeId = getRouterParam(event, 'universeId');
    if (! checkUniverseId(universeId)) {
        return throwError(400, 'Bad request, no universeId.');
    }
    const clusterId = getRouterParam(event, 'clusterId');
    if (! checkClusterId(clusterId)) {
        return throwError(400, 'Bad request, no clusterId.');
    }
    const systemId = getRouterParam(event, 'systemId');
    if (! checkSystemId(systemId)) {
        return throwError(400, 'Bad request, no systemId.');
    }
    const system = await getSystemData(universeId, clusterId, systemId);
    console.log('api/universe/[universeId]/[clusterId]/system/[systemId] system: ', system);
    if (! checkSystemExists(system)) {
        return throwError(404, 'System not found');
    }
    return system;
});