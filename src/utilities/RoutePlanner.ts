import type {ClusterModelInterface} from "@/types/ClusterTypes";
import type {SystemModelInterface} from "@/types/SystemTypes";
import type {RoutePlannerInterface, RoutePlanType} from "@/types/RoutePlannerTypes";

export class RoutePlanner implements RoutePlannerInterface {

  cluster: ClusterModelInterface;

  constructor(cluster: ClusterModelInterface) {
    this.cluster = cluster;
    console.log('this.cluster: ', this.cluster);
  }

  plan(systemA: SystemModelInterface, systemB: SystemModelInterface): RoutePlanType | undefined {

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

    console.log(`routePlans for ${systemA.name} to ${systemB.name}`, routePlans);

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

    console.log('{min, shortestPlan}', {min, shortestPlan});

    return shortestPlan;
  }

  findRoutes(systemA: SystemModelInterface, systemB: SystemModelInterface, routePlan: RoutePlanType): RoutePlanType[] | undefined {
    if (routePlan?.includes(systemA)) {
      return undefined;
    }
    const newRoutePlans: Array<RoutePlanType> = [];
    const connectedSystems = systemA.getConnectedSystems() || [] as Array<SystemModelInterface>;
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

export function createRoutePlanner(cluster: ClusterModelInterface): RoutePlannerInterface {
  return new RoutePlanner(cluster);
}
