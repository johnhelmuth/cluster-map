import type {ClusterIdType, ClusterModelInterface, ClustersModelInterface} from "@/types/ClusterTypes";


export class ClustersModel implements ClustersModelInterface {
  _cluster: ClusterModelInterface;
  _clusters: Map<ClusterIdType, ClusterModelInterface>;

  constructor(data: Array<ClusterModelInterface>) {
    this._clusters = new Map<ClusterIdType, ClusterModelInterface>();
    if (data && data?.clusters?.length > 0) {
      for (const cluster of data.clusters as Array<ClusterModelInterface>) {
        // @TODO: parse raw JSON data here?
        this._clusters.set(cluster.id, cluster);
      }
      if ((! data?.currentClusterId || data.currentClusterId === "")) {
        if (this._clusters.size > 0) {
          const firstCluster = [...this.clusters][0];
          if (firstCluster) {
            this._cluster = firstCluster;
          }
        }
      } else {
        const selectedCluster = this.getClusterById(data.currentClusterId);
        if (selectedCluster) {
          this._cluster = selectedCluster;
        }
      }
    }
  }

  get cluster(): ClusterModelInterface {
    return this._cluster;
  }

  set cluster(newCluster: ClusterModelInterface) {
    if (this._cluster !== newCluster) {
      this.addCluster(newCluster);
      this._cluster = newCluster;
    }
  }

  get clusters() {
    return this._clusters.values();
  }

  addCluster(newCluster: ClusterModelInterface) : void {
    this._clusters.set(newCluster.id, newCluster);
  }

  getClusterById(id: ClusterIdType) : ClusterModelInterface {
    return this._clusters.get(id);
  }

  getClusterByName(name: string) : ClusterModelInterface {
    return [...this.clusters].find(cluster => cluster.name === name);
  }

  selectClusterById(id: ClusterIdType): void {
    const selectedCluster = this.getClusterById(id);
    if (selectedCluster) {
      this._cluster = selectedCluster;
    }
  }

  selectClusterByName(name: string) {
    const selectedCluster = this.getClusterByName(name);
    if (selectedCluster) {
      this._cluster = selectedCluster;
    }
  }
}
