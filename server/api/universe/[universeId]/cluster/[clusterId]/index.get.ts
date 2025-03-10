
import {
    checkClusterExists,
    checkClusterId,
    checkUniverseId,
    getClusterData,
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
    const cluster = await getClusterData(universeId, clusterId);
    console.log('api/universe/[universeId]/[clusterId] cluster: ', cluster);
    if (! checkClusterExists(cluster)) {
        return throwError(400, 'Cluster not found');
    }
    return cluster;
});