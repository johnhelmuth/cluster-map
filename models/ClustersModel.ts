
import {type ClusterIdType, ClusterModel, type ClusterModelData} from "@/models/ClusterModel";
import {SCHEMA_VERSION} from "@/constants";
import {clustersParse} from "~/utils/import-validator";

export interface ClustersModelData {
  currentClusterId: ClusterIdType,
  clusters: Array<ClusterModelData>
}

export function isClustersModelData(data: any) : data is ClustersModelData {
  return clustersParse(data).valid;
}

export class ClustersModel {
  _cluster: ClusterModel | undefined;
  _clusters: Map<ClusterIdType, ClusterModel>;

  constructor(data: ClustersModelData) {
    this._clusters = new Map<ClusterIdType, ClusterModel>();
    this.parseClustersData(data);
  }

  parseClustersData(clustersData: ClustersModelData | undefined) {
    this._clusters.clear();
    if (clustersData && clustersData?.clusters?.length > 0) {
      for (const clusterData of clustersData.clusters as Array<ClusterModelData>) {
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

  get cluster(): ClusterModel | undefined {
    return this._cluster;
  }

  set cluster(newCluster: ClusterModel) {
    if (this._cluster !== newCluster) {
      this.addCluster(newCluster);
      this._cluster = newCluster;
    }
  }

  get clusters() : Array<ClusterModel> {
    return [...this._clusters.values()];
  }

  addCluster(newCluster: ClusterModel) : void {
    this._clusters.set(newCluster.id, newCluster);
    if (this._clusters.size === 1) {
      this._cluster = newCluster;
    }
  }

  getClusterById(id: ClusterIdType) : ClusterModel | undefined{
    return this._clusters.get(id);
  }

  getClusterByName(name: string) : ClusterModel | undefined {
    return [...this.clusters].find(cluster => cluster.name === name);
  }

  getClusterBySlugOrId(slugOrId: string) : ClusterModelInterface | undefined {
    let cluster = undefined;
    if (slugOrId) {
      cluster = this.getClusterById(slugOrId);
      if (! cluster) {
        cluster = [...this.clusters].find(cluster => cluster.slug === slugOrId);
      }
    }
    return cluster;
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