
import type {SystemIdType, SystemModel} from "~/models/SystemModel";
import type {ClusterModel} from "~/models/ClusterModel";

export type SelectedSystemLogType = { seq: number, system: SystemModel };
export type SelectedSystemMapType = Map<SystemIdType, SelectedSystemLogType>;


type LastSelectedRecord = { max: number, lastSystemSelected: SystemModel | undefined };

const MAX_SELECTED_SYSTEMS_COUNT = 2;

export class SelectedSystemsList {

  _selectedSystems : SelectedSystemMapType;
  _cluster: ClusterModel;

  static _selectedSequence = 0;

  constructor(cluster: ClusterModel) {
    this._cluster = cluster;
    this._selectedSystems = new Map<SystemIdType, SelectedSystemLogType>() as SelectedSystemMapType;
  }

  get selectedSystems(): Array<SystemModel> {
    return [...this._selectedSystems.values()].map(selectedSystemLog => {
      return selectedSystemLog.system
    });
  }

  get size() {
    return this._selectedSystems.size;
  }

  get maxSelected(): boolean {
    return this._selectedSystems.size >= MAX_SELECTED_SYSTEMS_COUNT;
  }

  selectSystem(system: SystemModel) : void {
    system.toggleSelected();
    if (system.getSelected() && ! this._selectedSystems.has(system.id)) {
      if (this.maxSelected) {
        const initialLastSelectedRecord : LastSelectedRecord = { max: -1, lastSystemSelected: undefined };
        const {max, lastSystemSelected} =
          [...this._selectedSystems.values()].reduce(
            ({max, lastSystemSelected}, {seq, system}: SelectedSystemLogType) => {
              if (seq > max) {
                return {max: seq, lastSystemSelected: system};
              }
              return {max, lastSystemSelected};
            },
            initialLastSelectedRecord
          );
        if (max !== -1 && !! lastSystemSelected) {
          this._selectedSystems.delete(lastSystemSelected.id);
          lastSystemSelected.toggleSelected();
        }
      }
      SelectedSystemsList._selectedSequence++;
      this._selectedSystems.set(system.id, { seq: SelectedSystemsList._selectedSequence, system });
    } else if (this._selectedSystems.has(system.id)) {
      this._selectedSystems.delete(system.id);
    }
  }
}
