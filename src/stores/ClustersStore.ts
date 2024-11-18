import {ref, reactive} from 'vue';

import {ClusterModel} from "@/models/ClusterModel";
import {ClustersModel} from "@/models/ClustersModel";
import clusterJsonDLC from "@/data/clusters/cluster-DLC.json";
import clusterJson2091 from "@/data/clusters/cluster-2091.json";
import type {ClustersModelInterface} from "@/types/ClusterTypes";

// TODO: Actually get this from persistent storage instead of from the codebase.
const clusters: ClustersModelInterface = reactive(new ClustersModel({currentClusterId: clusterJsonDLC.id, clusters: [clusterJsonDLC, clusterJson2091]}));

export function useClustersStore() : { clusters: ClustersModelInterface } {
  return { clusters };
}
