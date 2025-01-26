
import {getClusterData} from "~/server/utils/paramUtils";

export default defineEventHandler(async (event) => {

    const universeId = getRouterParam(event, 'universeId');
    const clusterId = getRouterParam(event, 'clusterId');
    console.log('api/universe/[universeId]/cluster/[clusterId]/systems universeId: ', universeId);
    console.log('api/universe/[universeId]/cluster/[clusterId]/systems clusterId: ', clusterId);
    const cluster = await getClusterData(universeId, clusterId);
    if (! cluster) {
        console.error('api/universe/[universeId]/cluster/[clusterId]/systems No cluster found in that universe with that clusterId.');
        throw createError({
            statusCode: 404,
            statusMessage: 'Cluster not found',
        });
    }
    console.log('api/universe/[universeId]/cluster/[clusterId]/systems cluster: ', cluster);
    const systems = [];
    cluster.systems.forEach((system  ) => {
        const { id, name, attributes, aspects } = system;
        systems.push({id, name, attributes, aspects});
    });
    console.log('api/universe/[universeId]/clusters systems: ', systems);
    return systems;
});