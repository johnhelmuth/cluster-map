import type {
  ClusterIdType, ClusterModelDataType,
  ClusterModelInterface, UniverseIdType,
  UniverseModelDataType,
  UniverseModelInterface
} from "@/types/ClusterTypes";
import {ClusterModel} from "@/models/ClusterModel";
import {SCHEMA_VERSION} from "@/constants";
import {getRandomIntInclusive} from "~/utils/cluster-generator";
import { validateUniverseData } from "~/utils/import-validator";

export class UniverseModel implements UniverseModelInterface {

  _cluster: ClusterModelInterface | undefined;
  _clusters: Map<ClusterIdType, ClusterModelInterface>;

  id: UniverseIdType;
  description: string;

  logLabel: string;

  constructor(data?: UniverseModelDataType) {
    this.logLabel = import.meta.client ? 'CLIENT: ' : 'SERVER: ';
    this.id = '';
    this.description = '';
    this._clusters = new Map<ClusterIdType, ClusterModelInterface>();
    this.parseUniverseData(data);
  }

  parseUniverseData(universeData: { } | undefined) {
    this._clusters.clear();
    console.log(`${this.logLabel} UniverseModel.parseUniverseData() universeData: `, universeData);
    if (universeData && validateUniverseData(universeData)) {
      if (universeData?.id) {
        this.id = universeData.id;
      } else {
        this.id = this.getNewUniverseId();
      }
      if (universeData?.description) {
        this.description = universeData.description;
      } else {
        this.description = 'Very mysterious universe.';
      }
      console.log(`${this.logLabel}UniverseModel.parseUniverseData() universeData?.clusters: `, universeData?.clusters);
      if (universeData?.clusters?.length > 0) {
        for (const clusterData of universeData.clusters as Array<ClusterModelDataType>) {
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
    } else {
      throw new Error('UniverseModel passed invalid universeData.');
    }
    console.log(`${this.logLabel}UniverseModel.parseUniverseData() finished. this: `, this);
  }

  getNewUniverseId() {
    return String(getRandomIntInclusive(1,1000000));
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
      id: this.id || '',
      currentClusterId: this.cluster?.id || '',
      description: this.description || '',
      clusters: [...this._clusters.values()]
    };
  }
}
