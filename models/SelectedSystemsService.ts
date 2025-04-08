
import {SelectedSystemsList} from "@/models/SelectedSystemsList";
import type {ClusterIdType} from "~/models/ClusterModel";
import {ClusterModel} from "~/models/ClusterModel";

export class SelectedSystemsService {

  _selectedSystemsForCluster : Map<ClusterIdType, SelectedSystemsList>;

  constructor() {
    this._selectedSystemsForCluster = new Map<ClusterIdType, SelectedSystemsList>();
  }

  getSelectedSystemsForCluster(cluster: ClusterModel) : SelectedSystemsList | undefined {
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
