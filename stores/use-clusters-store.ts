// import {defineStore} from 'pinia';
// import {reactive, watch} from "vue";

import {ClustersModel, isClustersModelData} from "~/models/ClustersModel";
import clusterJsonDLC from "~/data/clusters/cluster-DLC.json";
import clusterJson1652 from "~/data/clusters/cluster-1652.json";
import clusterJson2Systems from "~/data/clusters/cluster-3.json";
import {clustersParse, createSchemaValidationError} from "~/utils/import-validator";

const defaultClustersData = {
    currentClusterId: clusterJsonDLC.id,
    clusters: [
        clusterJsonDLC,
        clusterJson1652,
        clusterJson2Systems
    ]
};

if (! isClustersModelData(defaultClustersData)) {
    const parsedResponse = clustersParse(defaultClustersData);
    throw createSchemaValidationError(parsedResponse, 'useClustersStore setup, invalid defaultClustersData. ');
}

let clustersData;
// /** Check if `clusters` data is in LocalStorage **/
// const clustersDataFromLCJSON = localStorage.getItem("pinia.cluster-map.clusters");
// if (clustersDataFromLCJSON) {
//     try {
//         clustersData = JSON.parse(clustersDataFromLCJSON);
//     } catch (e) {
//         console.error(e);
//         clustersData = undefined;
//     }
// }
clustersData = clustersData || defaultClustersData;
// @ts-ignore
const clusters = reactive(new ClustersModel(clustersData));

export function useClustersStore() {

    // /** Store changes to `clusters` in LocalStorage **/
    // watch(
    //     clusters,
    //     () => {
    //         localStorage.setItem("pinia.cluster-map.clusters", JSON.stringify(clusters));
    //     },
    //     { deep: true }
    // );

    return { clusters };
}


