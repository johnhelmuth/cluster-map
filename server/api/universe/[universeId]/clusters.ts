import {getUniverseData, getClustersData, getSystemsData} from "~/server/utils/DataSourceDb";


export default defineEventHandler(async (event ) => {
  const universeId = getRouterParam(event, 'universeId');
  console.log('universeId: ', universeId);
  // if (universeId) {
  //   const universeData = await getUniverseData(universeId);
  //   // console.log('universeData: ', universeData);
  //   if (universeData?.clusters && Array.isArray(universeData.clusters)) {
  //     console.log('universeData.clusters: ', universeData.clusters);
  //     const clustersData = await getClustersData(universeData.clusters);
  //     console.log('clustersData: ', clustersData);
  //     for (const clusterData of clustersData) {
  //       if (clusterData?.systems && Array.isArray(clusterData.systems)) {
  //         const systemIds = clusterData.systems;
  //         console.log('systemIds: ', systemIds);
  //         const systemsData = await getSystemsData(systemIds);
  //         console.log('systemsData: ', systemsData);
  //       }
  //     }
  //   }
  // }
})