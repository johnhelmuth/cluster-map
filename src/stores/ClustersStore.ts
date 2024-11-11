import {ref, reactive} from 'vue';

import {ClusterModel} from "@/models/ClusterModel";
import {ClustersModel} from "@/models/ClustersModel";
import clusterJson from "@/data/cluster.json";
import type {ClustersModelInterface} from "@/types/ClusterTypes";

// TODO: Actually get this from persistent storage instead of from the codebase.
const clusterFromData = new ClusterModel(clusterJson);
const clusters: ClustersModelInterface = reactive(new ClustersModel({currentClusterId: clusterFromData.id, clusters: [clusterFromData]}));

export function useClustersStore() : { clusters: ClustersModelInterface } {
  return { clusters };
}
