import type {ClusterModelInterface} from "@/types/ClusterTypes";
import type {SystemModelInterface} from "@/types/SystemTypes";
import type {StraitModelInterface} from "@/types/StraitTypes";

export type RoutePlanType = Array<SystemModelInterface>;

export interface RoutePlannerInterface {
  cluster: ClusterModelInterface;
  plan(systemA: SystemModelInterface, systemB: SystemModelInterface): RoutePlanType | null ;
}

