import type {SystemIdType, SystemModelInterface} from "@/types/SystemTypes";

export type SelectedSystemLogType = { seq: number, system: SystemModelInterface };
export type SelectedSystemMapType = Map<SystemIdType, SelectedSystemLogType>;

export interface SelectedSystemsListInterface {
  size: number;
  isMaxSelected: boolean;
  selectedSystems: Array<SystemModelInterface>;
  selectSystem(system: SystemModelInterface) : void;
  systemIsSelected(system: SystemModelInterface): boolean;
  clearSelectedSystems() : void;
}
