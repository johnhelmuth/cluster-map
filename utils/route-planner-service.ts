import type {RoutePlannerServiceInterface} from "@/types/RoutePlannerServiceTypes";
import type {RoutePlanType} from "@/types/RoutePlannerTypes";
import {SelectedSystemsList} from "~/models/SelectedSystemsList";
import type {SystemModelInterface} from "~/types/SystemTypes";
import type {StraitModelInterface} from "~/types/StraitTypes";
import type {ClusterModelInterface} from "~/types/ClusterTypes";

export class RoutePlannerService implements RoutePlannerServiceInterface {

  _routePlans = [] as RoutePlanType[];
  _currentRoutePlanIndex = undefined as number | undefined;
  _selectedSystemsList = new SelectedSystemsList();

  get selectedSystemsList(): SelectedSystemsList {
    return this._selectedSystemsList;
  }

  get routePlans() {
    return this._routePlans;
  }

  get originSystem() {
    if (this._selectedSystemsList.size > 0) {
      return this.selectedSystemsList.selectedSystems[0];
    }
  }

  get destinationSystem() {
    if (this._selectedSystemsList.size > 1) {
      return this.selectedSystemsList.selectedSystems[1];
    }
  }

  get routePlan() {
    if (this._routePlans.length > 0
      && typeof this._currentRoutePlanIndex !== "undefined"
    ) {
      return this._routePlans?.[this._currentRoutePlanIndex];
    }
  }

  setRoutePlan(routePlanIndex: number): void {
    if (typeof this._routePlans?.[routePlanIndex] !== 'undefined') {
      this._currentRoutePlanIndex = routePlanIndex;
    }
  }

  isCurrentPlanIndex(routePlanIndex: number): boolean {
    return routePlanIndex === this._currentRoutePlanIndex;
  }

  isCurrentPlan(routePlan: RoutePlanType): boolean {
    return routePlan === this.routePlan;
  }

  deleteAllRoutePlans(): void {
    this._routePlans = [] as RoutePlanType[];
  }

  swapEndpoints() {
    if (this.selectedSystemsList.isMaxSelected) {
      const sysO = this.selectedSystemsList.selectedSystems[0] as SystemModelInterface;
      const sysD = this.selectedSystemsList.selectedSystems[1] as SystemModelInterface;
      this.selectedSystemsList.clearSelectedSystems();
      this.selectedSystemsList.selectSystem(sysD);
      this.selectedSystemsList.selectSystem(sysO);
      const savedCurrentPlanIndex = this._currentRoutePlanIndex;
      this.plan(sysD, sysO);
      if (typeof savedCurrentPlanIndex !== 'undefined' && savedCurrentPlanIndex < this.routePlans.length) {
        this.setRoutePlan(savedCurrentPlanIndex);
      }
    }
  }

  plan(systemA: SystemModelInterface, systemB: SystemModelInterface) {

    if (
      !systemA || !systemB
      || systemA === systemB
    ) {
      this.deleteAllRoutePlans();
      this._currentRoutePlanIndex = undefined;
    }

    /** Walk the straits between systemA and systemB gathering the list of straits in between, return the shortest list. */
    const routePlans = this.findRoutes(systemA, systemB, []) || [] as RoutePlanType[];

    if (routePlans?.length > 0) {
      this._routePlans = routePlans.sort((a: RoutePlanType, b: RoutePlanType) => a.length - b.length);
      this._currentRoutePlanIndex = 0;
    }
  }

  findRoutes(systemA: SystemModelInterface, systemB: SystemModelInterface, routePlan: RoutePlanType): RoutePlanType[] | undefined {
    if (routePlan?.includes(systemA)) {
      return undefined;
    }
    const newRoutePlans: Array<RoutePlanType> = [];

    const interClusterTrip = (systemA.cluster !== systemB.cluster);
    const connectedStraits = systemA.cluster.getStraitsBySystem(systemA, interClusterTrip) || [] as Array<StraitModelInterface>;
    const isSystemBConnected = connectedStraits.some(
      strait => {
        return [strait.straitPointA.system, strait.straitPointB.system].includes(systemB);
      }
    );
    if (isSystemBConnected) {
      const newRoutePlan = [...routePlan, systemA, systemB] as RoutePlanType;
      newRoutePlans.push(newRoutePlan);
      return newRoutePlans;
    }
    for (const strait of connectedStraits) {
      const newRoutePlan: RoutePlanType = [...routePlan, systemA];

      const straitPoint = strait.straitPointA.system === systemA ? strait.straitPointB : strait.straitPointA;

      if (straitPoint.system === systemB) {
        /* Unlikely to happen because of the code above that checks for systemB being in systemA's connected systems. */
        continue;
      }
      /* Recursively look to see if we can find one or more routes from this connected system to systemB otherwise. */
      const otherNewRoutePlans = this.findRoutes(straitPoint.system, systemB, newRoutePlan);
      if (otherNewRoutePlans?.length) {
        newRoutePlans.push(...otherNewRoutePlans);
      }
    }
    return newRoutePlans;
  }

  hasPlan(planIndex: number) {
    return typeof this._routePlans[planIndex] !== "undefined";
  }

  clustersOnPlan(planIndex: number): ClusterModelInterface[] | undefined {
    const plan = this.routePlans[planIndex];
    if (plan) {
      return plan.map(s => s.cluster);
    }
  }

  clustersOnCurrentPlan() {
    if (typeof this._currentRoutePlanIndex !== "undefined") {
      return this.clustersOnPlan(this._currentRoutePlanIndex);
    }
  }

  clusterInCurrentPlan(cluster?: ClusterModelInterface): boolean {
    return !!(cluster && this.clustersOnCurrentPlan()?.some(c => c === cluster))
  }

  straitInRoutePlan(strait: StraitModelInterface) {
    if (this.routePlan) {
      let lastSystem = null;
      for (const system of this.routePlan) {
        if (lastSystem !== null) {
          if (strait.includes(lastSystem) && strait.includes(system)) {
            return true;
          }
        }
        lastSystem = system;
      }
    }
    return false;
  }
}
