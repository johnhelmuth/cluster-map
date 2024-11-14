
import type {RoutePlannerServiceInterface} from "@/types/RoutePlannerServiceTypes";
import type {ClusterIdType, ClusterModelInterface} from "@/types/ClusterTypes";
import type {RoutePlanType, RoutePlanRefType} from "@/types/RoutePlannerTypes";

import { ref } from 'vue';


export class RoutePlannerService implements RoutePlannerServiceInterface {

  _routePlans : Map<ClusterIdType, RoutePlanRefType>;

  constructor() {
    this._routePlans = new Map<ClusterIdType, RoutePlanRefType>();
  }

  getRoutePlanForCluster(cluster: ClusterModelInterface) : RoutePlanRefType {
    if (this._routePlans.has(cluster.id)) {
      return this._routePlans.get(cluster.id);
    }
    const routePlan = ref([] as RoutePlanType);
    this._routePlans.set(cluster.id, routePlan);
    return routePlan;
  }

  deleteRoutePlanForCluster(cluster: ClusterModelInterface) : void {
    const routePlan = this.getRoutePlanForCluster(cluster);
    routePlan.value = undefined;
  }

  deleteAllRoutePlans() : void {
    this._routePlans.clear();
  }

}
