import type {
  ClusterIdType, ClusterModelDataType,
  ClusterModelInterface,
  ClustersModelDataType,
  ClustersModelInterface
} from "@/types/ClusterTypes";
import {ClusterModel} from "@/models/ClusterModel";
import {SCHEMA_VERSION} from "@/constants";


export class ClustersModel implements ClustersModelInterface {
  _cluster: ClusterModelInterface | undefined;
  _clusters: Map<ClusterIdType, ClusterModelInterface>;

  constructor(data: ClustersModelDataType) {
    this._clusters = new Map<ClusterIdType, ClusterModelInterface>();
    this.parseClustersData(data);
  }

  parseClustersData(clustersData: ClustersModelDataType | undefined) {
    this._clusters.clear();
    if (clustersData && clustersData?.clusters?.length > 0) {
      for (const clusterData of clustersData.clusters as Array<ClusterModelDataType>) {
        if (clusterData?.id) {
          this._clusters.set(clusterData.id, new ClusterModel(clusterData));
        }
      }
      if ((! clustersData?.currentClusterId || clustersData.currentClusterId === "")) {
        if (this._clusters.size > 0) {
          const firstCluster = [...this.clusters][0];
          if (firstCluster) {
            this._cluster = firstCluster;
          }
        }
      } else {
        const selectedCluster = this.getClusterById(clustersData.currentClusterId);
        if (selectedCluster) {
          this._cluster = selectedCluster;
        }
      }
    }
  }

  get cluster(): ClusterModelInterface | undefined {
    return this._cluster;
  }

  set cluster(newCluster: ClusterModelInterface) {
    if (this._cluster !== newCluster) {
      this.addCluster(newCluster);
      this._cluster = newCluster;
    }
  }

  get clusters() : Array<ClusterModelInterface> {
    return [...this._clusters.values()];
  }

  addCluster(newCluster: ClusterModelInterface) : void {
    this._clusters.set(newCluster.id, newCluster);
    if (this._clusters.size === 1) {
      this._cluster = newCluster;
    }
  }

  getClusterById(id: ClusterIdType) : ClusterModelInterface | undefined{
    return this._clusters.get(id);
  }

  getClusterByName(name: string) : ClusterModelInterface | undefined {
    return [...this.clusters].find(cluster => cluster.name === name);
  }

  selectClusterById(id: ClusterIdType): void {
    const selectedCluster = this.getClusterById(id);
    if (selectedCluster) {
      this._cluster = selectedCluster;
    }
  }

  selectClusterByName(name: string) : void {
    const selectedCluster = this.getClusterByName(name);
    if (selectedCluster) {
      this._cluster = selectedCluster;
    }
  }

  toJSON(key: string): object {
    return {
      type: "clusters",
      schemaVersion: SCHEMA_VERSION,
      currentClusterId: this.cluster?.id || '',
      clusters: [...this._clusters.values()]
    };
  }
}
