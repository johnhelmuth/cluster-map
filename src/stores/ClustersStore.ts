import {ref, reactive} from 'vue';

import {ClustersModel} from "@/models/ClustersModel";
import clusterJsonDLC from "@/data/clusters/cluster-DLC.json";
import clusterJson1652 from "@/data/clusters/cluster-1652.json";
import type {ClustersModelInterface} from "@/types/ClusterTypes";

// TODO: Actually get this from persistent storage instead of from the codebase.
const clustersData = [
  clusterJsonDLC,
  clusterJson1652
];
const clusters: ClustersModelInterface = reactive(new ClustersModel({currentClusterId: clusterJsonDLC.id, clusters: clustersData}));

export function useClustersStore() : { clusters: ClustersModelInterface } {
  return { clusters };
}
