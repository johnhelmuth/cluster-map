

import {ClustersModelDataZSchema} from "~/types/ClusterTypes";

export function getParseClusters() {
  return (data: any) => {
    const parsedPOJO = JSON.parse(data);
    return ClustersModelDataZSchema.safeParse(parsedPOJO)
  }
}
