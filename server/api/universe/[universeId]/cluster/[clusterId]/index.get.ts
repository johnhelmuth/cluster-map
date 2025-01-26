
import {getClusterData} from "~/server/utils/paramUtils";

export default defineEventHandler(async (event) => {
    const universeId = getRouterParam(event, 'universeId');
    const clusterId = getRouterParam(event, 'clusterId');
    const cluster = await getClusterData(universeId, clusterId);
    console.log('api/universe/[universeId]/[clusterId] cluster: ', cluster);
    if (! cluster) {
        console.error('api/universe/[universeId]/cluster/[clusterId] No cluster found with that clusterID.');
        throw createError({
            statusCode: 404,
            statusMessage: 'Cluster not found',
        });
    }
    return cluster;
});