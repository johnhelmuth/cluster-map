import type {ClusterModelInterface} from "@/types/ClusterTypes";
import type {RoutePlanRefType} from "@/types/RoutePlannerTypes";

export interface RoutePlannerServiceInterface {
  getRoutePlanForCluster(cluster: ClusterModelInterface) : RoutePlanRefType;
  deleteRoutePlanForCluster(cluster: ClusterModelInterface) : void;
  deleteAllRoutePlans() : void;
}
