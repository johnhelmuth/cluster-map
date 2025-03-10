
import {
    checkClusterExists,
    checkClusterId, checkSystemExists,
    checkUniverseId,
    getClusterData,
    throwError
} from "~/server/utils/paramUtils";
import type {AspectType} from "~/types/BasicTypes";
import type {SystemAttributesInterface, SystemIdType} from "~/types/SystemTypes";

export default defineEventHandler(async (event) => {

    const universeId = getRouterParam(event, 'universeId');
    if (! checkUniverseId(universeId)) {
        return throwError(400, 'Bad request, no universeId.');
    }
    const clusterId = getRouterParam(event, 'clusterId');
    if (! checkClusterId(clusterId)) {
        return throwError(400, 'Bad request, no clusterId.');
    }

    console.log('api/universe/[universeId]/cluster/[clusterId]/systems universeId: ', universeId);
    console.log('api/universe/[universeId]/cluster/[clusterId]/systems clusterId: ', clusterId);
    const cluster = await getClusterData(universeId, clusterId);
    if (! checkClusterExists(cluster)) {
        return throwError(400, 'Cluster not found');
    }
    console.log('api/universe/[universeId]/cluster/[clusterId]/systems cluster: ', cluster);
    const systems = [] as Array<{id : SystemIdType, name: string, attributes: SystemAttributesInterface, aspects: Array<AspectType>}>;
    cluster.systems.forEach((system  ) => {
        const { id, name, attributes, aspects } = system;
        systems.push({id, name, attributes, aspects});
    });
    console.log('api/universe/[universeId]/clusters systems: ', systems);
    return systems;
});