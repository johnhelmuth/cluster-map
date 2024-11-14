import type {ClusterModelInterface} from "@/types/ClusterTypes";
import type {SystemModelInterface} from "@/types/SystemTypes";
import type {Ref} from "vue";

export type RoutePlanType = Array<SystemModelInterface>;
export type RoutePlanRefType = Ref<RoutePlanType>;

export interface RoutePlannerInterface {
  cluster: ClusterModelInterface;
  plan(systemA: SystemModelInterface, systemB: SystemModelInterface): RoutePlanType | undefined;
}

