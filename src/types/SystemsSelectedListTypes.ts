import type {SystemIdType, SystemModelInterface} from "@/types/SystemTypes";
import type {ClusterModelInterface} from "@/types/ClusterTypes";


export type SelectedSystemLogType = { seq: number, system: SystemModelInterface };
export type SelectedSystemMapType = Map<SystemIdType, SelectedSystemLogType>;

export interface SelectedSystemsListInterface {
  size: number;
  maxSelected: boolean;
  selectSystem(system: SystemModelInterface) : void;
  getSelectedSystemsForCluster(cluster) : SelectedSystemMapType;
}

export interface SelectedSystemsServiceInterface {
  getSelectedSystemsForCluster(cluster: ClusterModelInterface) : SelectedSystemsListInterface;
  deleteAllSelectedSystems() : void;
}
