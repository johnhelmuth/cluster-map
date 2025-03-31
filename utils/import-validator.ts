

import {UniverseModelDataZSchema} from "~/types/ClusterTypes";

export function getParseClusters() {
  return (data: any) => {
    const parsedPOJO = JSON.parse(data);
    return UniverseModelDataZSchema.safeParse(parsedPOJO)
  }
}
