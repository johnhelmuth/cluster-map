import type {
  SelectedSystemsListHydratedDataType,
  SelectedSystemsListInterface, SelectedSystemsServiceDataType,
  SelectedSystemsServiceInterface
} from "@/types/SystemsSelectedListTypes";
import type {ClusterIdType, ClusterModelInterface} from "@/types/ClusterTypes";
import {SelectedSystemsList} from "@/models/SelectedSystemsList";
import type {SystemModelInterface} from "~/types/SystemTypes";


export class SelectedSystemsService implements SelectedSystemsServiceInterface {

  _selectedSystemsForCluster : Map<ClusterIdType, SelectedSystemsListInterface>;

  constructor() {
    this._selectedSystemsForCluster = new Map<ClusterIdType, SelectedSystemsListInterface>();
  }

  loadData(data: Array<[ClusterIdType, SelectedSystemsListHydratedDataType]>): void {
    if (data && Array.isArray(data)) {
      this.deleteAllSelectedSystems();
      data.forEach(([clusterId, selectedSystemListData]) => {
        const selectedSystemsList = this.getSelectedSystemsForCluster(clusterId);
        if (selectedSystemsList) {
          selectedSystemListData.forEach((system) => {
            selectedSystemsList.selectSystem(system);
          })
        }
      })
    }
  }

  getSelectedSystemsForCluster(clusterId: ClusterIdType) : SelectedSystemsListInterface | undefined {
    if (this._selectedSystemsForCluster.has(clusterId)) {
      return this._selectedSystemsForCluster.get(clusterId);
    }
    const selectedSystemsList = new SelectedSystemsList([]);
    this._selectedSystemsForCluster.set(clusterId, selectedSystemsList);
    return selectedSystemsList;
  }

  deleteAllSelectedSystems() : void {
    this._selectedSystemsForCluster.clear();
  }

  toJSON() : SelectedSystemsServiceDataType {
    return [...this._selectedSystemsForCluster.entries()].map(([clusterId, selectedSystemsList]) => {
      return [
          clusterId,
          selectedSystemsList.selectedSystems.map((system) => system.id)
      ]
    });
  }
}
