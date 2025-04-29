
import {type ClusterIdType, ClusterModel, type ClusterModelData} from "@/models/ClusterModel";
import {SCHEMA_VERSION} from "@/constants";
import {universeParse} from "~/utils/import-validator";
import type {IdType} from "~/types/BasicTypes";

export type UniverseIdType = IdType;

export interface UniverseModelData {
  type: 'universe',
  schemaVersion: string,
  id: UniverseIdType,
  name: string,
  currentClusterId: ClusterIdType,
  clusters: Array<ClusterModelData>
}

export function isUniverseModelData(data: any) : data is UniverseModelData {
  return universeParse(data).valid;
}

export class UniverseModel {
  id = 'unknown' as UniverseIdType;
  name = 'unknown';
  _cluster: ClusterModel | undefined;
  _clusters: Map<ClusterIdType, ClusterModel>;

  constructor(data: UniverseModelData) {
    this._clusters = new Map<ClusterIdType, ClusterModel>();
    this.parseUniverseData(data);
  }

  parseUniverseData(universeData: UniverseModelData | undefined) {
    this._clusters.clear();
    if (universeData && isUniverseModelData(universeData)) {
      this.id = universeData.id;
      this.name = universeData.name;
      if (universeData && universeData.clusters.length > 0) {
        for (const clusterData of universeData.clusters as Array<ClusterModelData>) {
          if (clusterData?.id) {
            this._clusters.set(clusterData.id, new ClusterModel(clusterData));
          }
        }
        if ((!universeData.currentClusterId || universeData.currentClusterId === "")) {
          if (this._clusters.size > 0) {
            const firstCluster = [...this.clusters][0];
            if (firstCluster) {
              this._cluster = firstCluster;
            }
          }
        } else {
          const selectedCluster = this.getClusterById(universeData.currentClusterId);
          if (selectedCluster) {
            this._cluster = selectedCluster;
          }
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

  getClusterBySlugOrId(slugOrId: string) : ClusterModel | undefined {
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
      type: "universe",
      schemaVersion: SCHEMA_VERSION,
      currentClusterId: this.cluster?.id || '',
      clusters: [...this._clusters.values()]
    };
  }
}