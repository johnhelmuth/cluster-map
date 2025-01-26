
import {getUniverseData} from "~/server/utils/paramUtils";

export default defineEventHandler(async (event) => {
    const universeId = getRouterParam(event, 'universeId');
    console.log('api/universe/[universeId]/clusters universeId: ', universeId);
    const universe = await getUniverseData(universeId);
    if (! universe) {
        console.error('api/universe/[universeId]/clusters No universe found with that universeId.');
        throw createError({
            statusCode: 404,
            statusMessage: 'Universe not found',
        });
    }
    console.log('api/universe/[universeId]/clusters universe: ', universe);
    const clustersData = [];
    universe.clusters.forEach((cluster  ) => {
        const numSystems = cluster.numSystems
        const { id, name } = cluster;
        clustersData.push({id, name, numSystems});
    });
    console.log('api/universe/[universeId]/clusters clustersData: ', clustersData);
    return clustersData;
});