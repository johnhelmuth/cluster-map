import {ref, reactive} from 'vue';
import { defineStore } from 'pinia';

import {ClustersModel} from "@/models/ClustersModel";
import clusterJsonDLC from "@/data/clusters/cluster-DLC.json";
import clusterJson1652 from "@/data/clusters/cluster-1652.json";
import type {ClustersModelInterface} from "@/types/ClusterTypes";

const clustersData = [
  clusterJsonDLC,
  clusterJson1652
];

export const useClustersStore = defineStore(
  "clusters",
  {
    state: () => {
      const clusters: ClustersModelInterface = (new ClustersModel({currentClusterId: clusterJsonDLC.id, clusters: clustersData}));
      return { clusters };
    }
  }
)
