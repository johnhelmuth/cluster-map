import type {SystemIdType, SystemModelInterface} from "@/types/SystemTypes";


export type SelectedSystemLogType = { seq: number, system: SystemModelInterface };
export type SelectedSystemMapType = Map<SystemIdType, SelectedSystemLogType>;

export interface SelectedSystemsListInterface {
  size: number;
  maxSelected: boolean;
  selectSystem(system: SystemModelInterface) : void;
  getSelectedSystemsForCluster(cluster) : SelectedSystemMapType;
}
