import type {ClusterModelInterface} from "@/types/ClusterTypes";
import type {RoutePlanRefType} from "@/types/RoutePlannerTypes";

export interface RoutePlannerServiceInterface {
  getRoutePlanForCluster(cluster: ClusterModelInterface | undefined) : RoutePlanRefType | undefined;
  deleteRoutePlanForCluster(cluster: ClusterModelInterface) : void;
  deleteAllRoutePlans() : void;
}
