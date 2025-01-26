
import {getSystemData} from "~/server/utils/paramUtils";

export default defineEventHandler(async (event) => {
    const universeId = getRouterParam(event, 'universeId');
    const clusterId = getRouterParam(event, 'clusterId');
    const systemId = getRouterParam(event, 'systemId');
    const system = await getSystemData(universeId, clusterId, systemId);
    console.log('api/universe/[universeId]/[clusterId]/system/[systemId] system: ', system);
    if (! system) {
        console.error('api/universe/[universeId]/[clusterId]/system/[systemId] No system found in that cluster with that systemID.');
        throw createError({
            statusCode: 404,
            statusMessage: 'System not found',
        });
    }
    return system;
});