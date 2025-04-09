

import type {ClusterIdType, ClusterModel} from "~/models/ClusterModel";
import type {RoutePlanRefType, RoutePlanType} from "~/utils/route-planner";

export class RoutePlannerService {

  _routePlans : Map<ClusterIdType, RoutePlanRefType>;

  constructor() {
    this._routePlans = new Map<ClusterIdType, RoutePlanRefType>();
  }

  getRoutePlanForCluster(cluster?: ClusterModel | undefined) : RoutePlanRefType | undefined {
    if (! cluster) {
      return undefined;
    }
    if (this._routePlans.has(cluster.id)) {
      const routePlan = this._routePlans.get(cluster.id);
      if (routePlan) {
        return routePlan;
      }
    }
    const routePlan = ref([] as RoutePlanType) as RoutePlanRefType;
    this._routePlans.set(cluster.id, routePlan);
    return routePlan;
  }

  deleteRoutePlanForCluster(cluster: ClusterModel) : void {
    const routePlan = this.getRoutePlanForCluster(cluster);
    if (routePlan) {
      routePlan.value = [];
    }
  }

  deleteAllRoutePlans() : void {
    this._routePlans.clear();
  }

}
