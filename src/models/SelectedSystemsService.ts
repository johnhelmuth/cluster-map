import type {SelectedSystemsListInterface, SelectedSystemsServiceInterface} from "@/types/SystemsSelectedListTypes";
import type {ClusterIdType, ClusterModelInterface} from "@/types/ClusterTypes";
import {SelectedSystemsList} from "@/models/SelectedSystemsList";


export class SelectedSystemsService implements SelectedSystemsServiceInterface {

  _selectedSystemsForCluster : Map<ClusterIdType, SelectedSystemsListInterface>;

  constructor() {
    this._selectedSystemsForCluster = new Map<ClusterIdType, SelectedSystemsListInterface>();
  }

  getSelectedSystemsForCluster(cluster: ClusterModelInterface) : SelectedSystemsListInterface {
    if (this._selectedSystemsForCluster.has(cluster.id)) {
      return this._selectedSystemsForCluster.get(cluster.id);
    }
    const selectedSystemsList = new SelectedSystemsList(cluster);
    this._selectedSystemsForCluster.set(cluster.id, selectedSystemsList);
    return selectedSystemsList;
  }

  deleteAllSelectedSystems() : void {
    this._selectedSystemsForCluster.clear();
  }

}
