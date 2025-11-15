

import type {SystemModel} from "~/models/SystemModel";
import type {ClusterModel} from "~/models/ClusterModel";
import type {Ref} from "vue";

export type RoutePlanType = Array<SystemModel>;
export type RoutePlanRefType = Ref<RoutePlanType>;

export class RoutePlanner {

  cluster: ClusterModel;

  constructor(cluster: ClusterModel) {
    this.cluster = cluster;
  }

  plan(systemA: SystemModel, systemB: SystemModel): RoutePlanType | undefined {

    const systemsMap = this.cluster.systemsMap;

    if (
         ! systemA || ! systemB
      || systemA === systemB
      || !systemsMap.has(systemA.id) || !systemsMap.has(systemB.id)
    ) {
      return undefined;
    }

    /** Walk the straits between systemA and systemB gathering the list of straits in between, return the shortest list. */
    const routePlans = this.findRoutes(systemA, systemB, []) || [] as RoutePlanType[];

    type RoutePlanSortType = {
      min: number,
      shortestPlan: RoutePlanType | undefined,
    };
    const {min, shortestPlan} = routePlans.reduce(({min, shortestPlan} : RoutePlanSortType, plan : RoutePlanType) => {
      if (plan && plan.length < min) {
        return {min: plan.length, shortestPlan: plan}
      }
      return {min, shortestPlan};
    }, {min: Number.MAX_SAFE_INTEGER, shortestPlan: undefined});

    return shortestPlan;
  }

  findRoutes(systemA: SystemModel, systemB: SystemModel, routePlan: RoutePlanType): RoutePlanType[] | undefined {
    if (routePlan?.includes(systemA)) {
      return undefined;
    }
    const newRoutePlans: Array<RoutePlanType> = [];
    const connectedSystems = systemA.getConnectedSystems() || [] as Array<SystemModel>;
    if (connectedSystems.includes(systemB)) {
      const newRoutePlan = [...routePlan, systemA, systemB] as RoutePlanType;
      newRoutePlans.push(newRoutePlan);
      return newRoutePlans;
    }
    for (const system of connectedSystems) {
      const newRoutePlan: RoutePlanType = [...routePlan, systemA];
      if (system === systemB) {
        /* Unlikely to happen because of the code above that checks for systemB being in systemA's connected systems. */
        continue;
      }
      /* Recursively look to see if we can find one or more routes from this connected system to systemB otherwise. */
      const otherNewRoutePlans = this.findRoutes(system, systemB, newRoutePlan);
      if (otherNewRoutePlans?.length) {
        newRoutePlans.push(...otherNewRoutePlans);
      }
    }
    return newRoutePlans;
  }
}

export function createRoutePlanner(cluster: ClusterModel): RoutePlanner {
  return new RoutePlanner(cluster);
}
