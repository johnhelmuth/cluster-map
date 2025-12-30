import type {SystemIdType, SystemModelInterface} from "@/types/SystemTypes";
import type {ClusterIdType, ClusterModelInterface} from "@/types/ClusterTypes";

export type SelectedSystemsListDataType = Array<SystemIdType>;
export type SelectedSystemsListHydratedDataType = Array<SystemModelInterface>;
export type SelectedSystemsServiceDataType = Array<[ClusterIdType, SelectedSystemsListDataType]>;

export interface SelectedSystemsListInterface {
  length: number;
  maxSelected: boolean;
  selectedSystems: SelectedSystemsListHydratedDataType;
  selectSystem(system: SystemModelInterface) : void;
  toJSON(): SelectedSystemsListDataType;
}

export interface SelectedSystemsServiceInterface {
  loadData(data: Array<[ClusterIdType, SelectedSystemsListHydratedDataType]>): void;
  getSelectedSystemsForCluster(clusterId: ClusterIdType) : SelectedSystemsListInterface | undefined;
  deleteAllSelectedSystems() : void;
  toJSON() : SelectedSystemsServiceDataType
}
