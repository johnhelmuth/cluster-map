import {ref, reactive} from 'vue';

import {ClusterModel} from "@/models/ClusterModel";
import {ClustersModel} from "@/models/ClustersModel";
import clusterJson from "@/data/cluster.json";
import type {ClustersModelInterface} from "@/types/ClusterTypes";

// TODO: Actually get this from persistent storage instead of from the codebase.
const clusters: ClustersModelInterface = reactive(new ClustersModel({currentClusterId: clusterJson.id, clusters: [clusterJson]}));

export function useClustersStore() : { clusters: ClustersModelInterface } {
  return { clusters };
}
