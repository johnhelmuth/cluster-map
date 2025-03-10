
import {checkUniverseId, checkUniverseExists, getUniverseData, throwError} from "~/server/utils/paramUtils";
import {ClusterIdType} from "~/types/ClusterTypes";

export default defineEventHandler(async (event) => {
    const universeId = getRouterParam(event, 'universeId');
    if (! checkUniverseId(universeId)) {
        return throwError(400, 'Bad request, no universeId.');
    }
    const universe = await getUniverseData(universeId);
    if (! checkUniverseExists(universe)) {
        return throwError(404, 'Universe not found');
    }
    console.log('api/universe/[universeId]/clusters universe: ', universe);
    const clustersData = [] as Array<{ id: ClusterIdType, name: string, numSystems: number}>;
    universe.clusters.forEach((cluster  ) => {
        const numSystems = cluster.numSystems
        const { id, name } = cluster;
        clustersData.push({id, name, numSystems});
    });
    console.log('api/universe/[universeId]/clusters clustersData: ', clustersData);
    return clustersData;
});