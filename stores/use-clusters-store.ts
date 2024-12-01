// import {defineStore} from 'pinia';
// import {reactive, watch} from "vue";

import {ClustersModel} from "~/models/ClustersModel";
import clusterJsonDLC from "~/data/clusters/cluster-DLC.json";
import clusterJson1652 from "~/data/clusters/cluster-1652.json";
import type {ClustersModelInterface} from "~/types/ClusterTypes";

const defaultClustersData = {
    currentClusterId: clusterJsonDLC.id,
    clusters: [
        clusterJsonDLC,
        clusterJson1652
    ]
};

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
const clusters: ClustersModelInterface = reactive(new ClustersModel(clustersData));

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


