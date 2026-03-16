import type {
  ClusterIdType, ClusterModelDataType,
  ClusterModelInterface,
  ClustersModelDataType,
  ClustersModelInterface
} from "@/types/ClusterTypes";
import {ClusterModel} from "@/models/ClusterModel";
import {SCHEMA_VERSION} from "@/constants";
import type {SystemIdType, SystemModelInterface} from "~/types/SystemTypes";
import type {StraitModelDataType, StraitModelInterface, StraitPointDataType} from "~/types/StraitTypes";


export class ClustersModel implements ClustersModelInterface {
  _cluster: ClusterModelInterface | undefined;
  _clusters: Map<ClusterIdType, ClusterModelInterface>;

  _savedClusterStraits = new Map<ClusterIdType, Array<StraitModelDataType>>();

  constructor(data: ClustersModelDataType) {
    this._clusters = new Map<ClusterIdType, ClusterModelInterface>();
    this.parseClustersData(data);
  }

  parseClustersData(clustersData: ClustersModelDataType | undefined) {
    this._clusters.clear();
    if (clustersData && clustersData?.clusters?.length > 0) {
      for (const clusterData of clustersData.clusters as Array<ClusterModelDataType>) {
        if (clusterData?.id) {
          const cluster = new ClusterModel(clusterData, this);
          this._clusters.set(clusterData.id, cluster);
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
      this.postImport();
    }
  }

  postImport() {
    if (this._savedClusterStraits.size > 0) {
      for (const [clusterId, savedClusterStraits] of this._savedClusterStraits) {
        const cluster1 = this._clusters.get(clusterId);
        if (cluster1) {
          let straitsSavedCount = 0;
          for (const straitData of savedClusterStraits) {
            let cluster2Id: ClusterIdType;
            let system1Id: SystemIdType;
            let system2Id: SystemIdType;
            if (straitData.straitPointA.clusterId !== clusterId) {
              system1Id = straitData.straitPointB.systemId;
              cluster2Id = straitData.straitPointA.clusterId;
              system2Id = straitData.straitPointA.systemId;
            } else {
              system1Id = straitData.straitPointA.systemId;
              cluster2Id = straitData.straitPointB.clusterId;
              system2Id = straitData.straitPointB.systemId;
            }
            if (system1Id && cluster2Id && system2Id) {
              const cluster2 = this._clusters.get(cluster2Id)
              if (cluster2) {
                const system1 = cluster1.getSystemById(system1Id);
                const system2 = cluster2.getSystemById(system2Id);
                if (system1 && system2) {
                  const strait = cluster1.connectSystems(system1, system2);
                  if (strait && straitData?.direction) {
                    strait.setDrawDirection(straitData.direction, 'data');
                  }
                  if (strait && straitData?.galacticDirection) {
                    strait.setGalacticDirection(straitData.galacticDirection);
                  }
                  straitsSavedCount++
                }
              }
            }
          }
          if (straitsSavedCount !== savedClusterStraits.length) {
            console.log('Clusters.parseClustersData() straitsSavedCount !== savedClustersStraits.length');
            console.log('Clusters.parseClustersData() straitsSavedCount', straitsSavedCount);
            console.log('Clusters.parseClustersData() savedClustersStraits.length', savedClusterStraits.length);
            console.log('Clusters.parseClustersData() savedClustersStraits', savedClusterStraits);
            throw new Error(`Clusters.parseClustersData() Not all clusterStraits saved for cluster ${cluster1.id}`);
          }
        }
      }
      this._savedClusterStraits.clear();
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

  getSystemByStraitPointId(straitPoint: StraitPointDataType): SystemModelInterface | undefined {
    const { clusterId, systemId } = straitPoint;
    const cluster = this.getClusterById(clusterId);
    if (cluster) {
      return cluster.getSystemById(systemId);
    }
  }

  getAllStraitsBySystem(system: SystemModelInterface) {
    const cluster = system.cluster;

    const clusterStraitsFromSystem = cluster.getClusterStraits()
      .filter(strait => strait.straitPointA.system === system || strait.straitPointB.system === system)
    const straitsFromSystem = cluster.getStraitsBySystem(system);
    return [...(new Set([...straitsFromSystem, ...clusterStraitsFromSystem])).values()];
  }

  areConnected(systemA: SystemModelInterface, systemB: SystemModelInterface) {
    const clusterA = this.getClusterById(systemA.cluster.id);
    if (clusterA) {
      const clusterB = this.getClusterById(systemB.cluster.id);
      if (clusterB) {
        return clusterA.areConnected(systemA, systemB)
          || clusterB.areConnected(systemA, systemB);
      }
    }
    return false;
  }

  hasClusterStraits(cluster: ClusterModelInterface) {
    const clusterStraits = this._filterClusterStraits((strait) => {
      return (strait.straitPointA.cluster === cluster || strait.straitPointB.cluster === cluster);
    });
    return !! clusterStraits.length;
  }

  clusterIsInStrait(cluster: ClusterModelInterface, strait: StraitModelInterface): boolean {
    return (strait.straitPointA.cluster === cluster || strait.straitPointB.cluster === cluster);
  }

  getClusterStraitsByCluster(cluster: ClusterModelInterface) {
    const straits = this._filterClusterStraits((strait) => {
      return (strait.straitPointA.cluster === cluster || strait.straitPointB.cluster === cluster);
    });
    return straits;
  }

  _filterClusterStraits(filter: (strait: StraitModelInterface) => boolean) {
    const clusterStraits = [] as Array<StraitModelInterface>;
    for (const cluster of this.clusters) {
      const thisClusterStraits = cluster.straits
        .filter((strait) => strait.isClusterStrait() && filter(strait));
      clusterStraits.push(...thisClusterStraits);
    }
    return clusterStraits;
  }

  getClusterStraits() {
    return this._filterClusterStraits((strait: StraitModelInterface) => true);
  }

  saveClusterStraitForPostImport(cluster: ClusterModelInterface, straitData: StraitModelDataType) {
    let clusterStraits = [] as Array<StraitModelDataType>;
    if (this._savedClusterStraits.has(cluster.id)) {
      const currClusterStraits = this._savedClusterStraits.get(cluster.id);
      if (currClusterStraits) {
        clusterStraits = currClusterStraits;
      }
    }
    clusterStraits.push(straitData);
    this._savedClusterStraits.set(cluster.id, clusterStraits);
  }

  toJSON(key: string): object {
    return {
      type: "clusters",
      schemaVersion: SCHEMA_VERSION,
      currentClusterId: this.cluster?.id || '',
      clusters: [...this._clusters.values()],
    };
  }
}
