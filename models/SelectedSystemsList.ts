import type {SystemIdType, SystemModelInterface} from "@/types/SystemTypes";
import type {
  SelectedSystemsListDataType,
  SelectedSystemsListHydratedDataType,
  SelectedSystemsListInterface
} from "@/types/SystemsSelectedListTypes";

const MAX_SELECTED_SYSTEMS_COUNT = 2;

export class SelectedSystemsList implements SelectedSystemsListInterface {

  _selectedSystems : SelectedSystemsListHydratedDataType = [];

  constructor(data: SelectedSystemsListHydratedDataType) {
    this._selectedSystems = data;
  }

  get selectedSystems(): Array<SystemModelInterface> {
    return [...this._selectedSystems];
  }

  get length() {
    return this._selectedSystems.length;
  }

  get maxSelected(): boolean {
    return this._selectedSystems.length >= MAX_SELECTED_SYSTEMS_COUNT;
  }

  hasSystem(system: SystemModelInterface): boolean {
    return !! this._selectedSystems.find((sys) => system.id === sys.id)
  }

  selectSystem(system: SystemModelInterface) : void {
    system.toggleSelected();
    if (system.getSelected() && ! this.hasSystem(system)) {
      if (this.maxSelected) {
        // Replace the last element.
        this._selectedSystems[this.length-1] = system;
      } else {
        this._selectedSystems.push(system);
      }
    } else if (this.hasSystem(system)) {
      const index = this._selectedSystems.indexOf(system);
      if (index >= 0 && index < this.length) {
        this._selectedSystems.splice(index, 1);
      }
    }
  }

  toJSON(): SelectedSystemsListDataType {
    return this._selectedSystems.map(system => system.id);
  }
}
