import type {
  ClusterIdType, ClusterModelDataType,
  ClusterModelInterface, UniverseIdType,
  UniverseModelDataType,
  UniverseModelInterface
} from "@/types/ClusterTypes";
import {ClusterModel} from "@/models/ClusterModel";
import {SCHEMA_VERSION} from "@/constants";
import {isUniverseModelDataType} from "@/types/ClusterTypes";
import {getRandomIntInclusive} from "~/utils/cluster-generator";

export function getNewUniverseId() {
  return String(getRandomIntInclusive(1,1000000));
}
export class UniverseModel implements UniverseModelInterface {
  _cluster: ClusterModelInterface | undefined;
  _clusters: Map<ClusterIdType, ClusterModelInterface>;

  id: UniverseIdType;
  description: string;

  logLabel: string;

  constructor(data: any) {
    this.logLabel = import.meta.client ? 'CLIENT: ' : 'SERVER: ';
    this._clusters = new Map<ClusterIdType, ClusterModelInterface>();
    this.id = getNewUniverseId();
    this.description = 'Very mysterious universe.';
    this.parseUniverseData(data);
  }

  parseUniverseData(universeData: any) {
    this._clusters.clear();
    if (universeData && isUniverseModelDataType(universeData)) {
      if (universeData?.id) {
        this.id = universeData.id;
      }
      if (universeData?.description) {
        this.description = universeData.description;
      }
      if (universeData?.clusters.length > 0) {
        for (const clusterData of universeData.clusters) {
          if (clusterData?.id) {
            this._clusters.set(clusterData.id, new ClusterModel(clusterData));
          }
        }
        if ((! universeData?.currentClusterId || universeData.currentClusterId === "")) {
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
      type: "universe",
      schemaVersion: SCHEMA_VERSION,
      id: this.id || '',
      description: this.description || '',
      currentClusterId: this.cluster?.id || '',
      clusters: [...this._clusters.values()]
    };
  }
}
