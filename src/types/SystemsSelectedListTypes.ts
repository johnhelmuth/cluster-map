import type {SystemIdType, SystemModelInterface} from "@/types/SystemTypes";
import type {ClusterModelInterface, ClustersModelInterface} from "@/types/ClusterTypes";


export type SelectedSystemLogType = { seq: number, system: SystemModelInterface };
export type SelectedSystemMapType = Map<SystemIdType, SelectedSystemLogType>;

export interface SelectedSystemsListInterface {
  size: number;
  maxSelected: boolean;
  selectedSystems: Array<SystemModelInterface>;
  selectSystem(system: SystemModelInterface) : void;

}

export interface SelectedSystemsServiceInterface {
  getSelectedSystemsForCluster(cluster: ClusterModelInterface) : SelectedSystemsListInterface | undefined;
  deleteAllSelectedSystems() : void;
}
