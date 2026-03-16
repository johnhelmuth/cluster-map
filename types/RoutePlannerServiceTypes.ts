
import type {RoutePlanType} from "@/types/RoutePlannerTypes";
import type {SelectedSystemsList} from "~/models/SelectedSystemsList";
import type {SystemModelInterface} from "~/types/SystemTypes";
import type {ClusterModelInterface} from "~/types/ClusterTypes";
import type {StraitModelInterface} from "~/types/StraitTypes";

export interface RoutePlannerServiceInterface {

  selectedSystemsList: SelectedSystemsList;
  originSystem: SystemModelInterface | undefined;
  destinationSystem: SystemModelInterface | undefined;
  routePlans: RoutePlanType[] | undefined;
  routePlan: RoutePlanType | undefined;

  plan(systemA: SystemModelInterface, systemB: SystemModelInterface): void;
  swapEndpoints(): void;
  deleteAllRoutePlans() : void;
  hasPlan(planIndex: number): boolean;
  setRoutePlan(routePlanIndex: number): void
  isCurrentPlanIndex(routePlanIndex: number): boolean
  isCurrentPlan(routePlan: RoutePlanType): boolean
  clustersOnPlan(planIndex?: number): ClusterModelInterface[] | undefined
  clustersOnCurrentPlan(): ClusterModelInterface[] | undefined
  clusterInCurrentPlan(cluster: ClusterModelInterface): boolean;
  straitInRoutePlan(strait: StraitModelInterface): boolean;

}
