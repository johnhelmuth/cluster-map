import type {SystemIdType, SystemModelInterface} from "@/types/SystemTypes";
import type {SelectedSystemsListInterface, SelectedSystemMapType, SelectedSystemLogType} from "@/types/SystemsSelectedListTypes";
import type {ClusterModelInterface} from "@/types/ClusterTypes";

type LastSelectedRecord = { max: number, lastSystemSelected: SystemModelInterface | undefined };

const MAX_SELECTED_SYSTEMS_COUNT = 2;

export class SelectedSystemsList implements SelectedSystemsListInterface {

  _selectedSystems : SelectedSystemMapType;

  static _selectedSequence = 0;

  constructor() {
    this._selectedSystems = new Map<SystemIdType, SelectedSystemLogType>() as SelectedSystemMapType;
  }

  get size() {
    return this._selectedSystems.size;
  }

  get maxSelected(): boolean {
    return this._selectedSystems.size >= MAX_SELECTED_SYSTEMS_COUNT;
  }

  selectSystem(system: SystemModelInterface) : void {
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
      console.log('SelectedSystemsList.selectSystem() SelectedSystemsList._selectedSequence: ', SelectedSystemsList._selectedSequence);
      this._selectedSystems.set(system.id, { seq: SelectedSystemsList._selectedSequence, system });
      console.log('SelectedSystemsList.selectSystem() this._selectedSystems: ', this._selectedSystems);
    } else if (this._selectedSystems.has(system.id)) {
      this._selectedSystems.delete(system.id);
    }
  }

  getSelectedSystemsForCluster(cluster: ClusterModelInterface) : SelectedSystemMapType {
    const systemsArray = [...this._selectedSystems.entries()]
      .filter(([systemId, {system}]) => {
        return system.cluster === cluster;
      });
    console.log('SelectedSystemsList.getSelectedSystemsForCluster() systemsArray: ', systemsArray);
    const systemsForCluster
      = new Map<SystemIdType, SelectedSystemMapType>(systemsArray);
    console.log('SelectedSystemsList.getSelectedSystemsForCluster() systemsForCluster: ', systemsForCluster);
    return systemsForCluster;
  }
}
