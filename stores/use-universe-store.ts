// import {defineStore} from 'pinia';
// import {reactive, watch} from "vue";

import {UniverseModel, isUniverseModelData} from "~/models/UniverseModel";
import clusterJsonDLC from "~/data/universes/cluster-DLC.json";
import clusterJson1652 from "~/data/universes/cluster-1652.json";
import clusterJson2Systems from "~/data/universes/cluster-3.json";
import {universeParse, createSchemaValidationError} from "~/utils/import-validator";

const defaultClustersData = {
    currentClusterId: clusterJsonDLC.id,
    clusters: [
        clusterJsonDLC,
        clusterJson1652,
        clusterJson2Systems
    ]
};

if (! isUniverseModelData(defaultClustersData)) {
    const parsedResponse = universeParse(defaultClustersData);
    throw createSchemaValidationError(parsedResponse, 'useUniverseStore setup, invalid defaultClustersData. ');
}

let clustersData;
// /** Check if `universes` data is in LocalStorage **/
// const clustersDataFromLCJSON = localStorage.getItem("pinia.cluster-map.universes");
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
const clusters = reactive(new UniverseModel(clustersData));

export function useUniverseStore() {

    // /** Store changes to `universes` in LocalStorage **/
    // watch(
    //     universes,
    //     () => {
    //         localStorage.setItem("pinia.cluster-map.universes", JSON.stringify(universes));
    //     },
    //     { deep: true }
    // );

    return { clusters };
}


