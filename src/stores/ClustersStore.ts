import {defineStore} from 'pinia';

import {ClustersModel} from "@/models/ClustersModel";
import clusterJsonDLC from "@/data/clusters/cluster-DLC.json";
import clusterJson1652 from "@/data/clusters/cluster-1652.json";
import type {ClustersModelInterface} from "@/types/ClusterTypes";
import {reactive} from "vue";

const defaultClustersData = {
  currentClusterId: clusterJsonDLC.id,
  clusters: [
    clusterJsonDLC,
    clusterJson1652
  ]
};

export const useClustersStore = defineStore(
  "clusters",
  () => {
    let clustersData;
    const clustersDataFromLCJSON = localStorage.getItem("pinia.cluster-map.clusters");
    if (clustersDataFromLCJSON) {
      try {
        clustersData = JSON.parse(clustersDataFromLCJSON).clusters;
      } catch (e) {
        console.error(e);
        clustersData = undefined;
      }
    }
    clustersData = clustersData || defaultClustersData;
    const clusters: ClustersModelInterface = reactive(new ClustersModel(clustersData));

    return { clusters };
  }
);


