/**
 * Cluster model types
 *
 * A Cluster is a set of star systems and how they are connected via FTL straits.
 *
 * The SystemModelInterface includes a StraitModelInterface shaped object for each of the systems it connects to.
 * These StraitModelInterface objects are shared between the 2 SystemModelInterface objects it connects.
 */
import type { IdType} from "@/types/BasicTypes";
import type { SystemIdType, SystemModelInterface} from "@/types/SystemTypes";
import type {StraitModelInterface} from "@/types/StraitTypes";
import type {SystemModelDataType} from "@/types/SystemTypes";
import type {StraitModelDataType} from "@/types/StraitTypes";


export type ClusterIdType = IdType;

export interface ClusterModelInterface {
  id: ClusterIdType;
  name: string;
  systemsMap: Map<SystemIdType, SystemModelInterface>;
  systems: Array<SystemModelInterface>;
  straits: Array<StraitModelInterface>;

  getSystemByName(systemName: string) : SystemModelInterface | null;

  getSystemById(systemId: SystemIdType) : SystemModelInterface | null | undefined;

  getSystemsMap() : Map<SystemIdType, SystemModelInterface>;

  addSystem(system: SystemModelInterface): void;

  connectSystems(systemA: SystemModelInterface, systemB: SystemModelInterface) : void;

  areConnected(systemA: SystemModelInterface, systemB: SystemModelInterface) : boolean

  getConnectionsForSystem(system: SystemModelInterface) : Array<StraitModelInterface>;

  importSystems(data: ClusterModelDataType) : void;
  importStraits(data: ClusterModelDataType) : void;

  toJSON(key: string) : object;
}

export type ClusterModelDataType = ClusterModelInterface |
  (Pick<ClusterModelInterface, "name">
    & Partial<Pick<ClusterModelInterface, "id">>
    & {
        systems?: Array<SystemModelDataType> | null,
        straits?: Array<StraitModelDataType> | Array<Array<SystemIdType>> | null
      }
  );

export interface ClustersModelInterface {
  cluster: ClusterModelInterface | undefined;
  clusters: Array<ClusterModelInterface>;

  parseClustersData(clustersData: ClustersModelDataType | undefined) : void;
  addCluster(cluster: ClusterModelInterface) : void;
  getClusterById(id: ClusterIdType) : ClusterModelInterface | undefined;
  getClusterByName(name: string) : ClusterModelInterface | undefined;
  selectClusterById(id: ClusterIdType): void;
  selectClusterByName(name: string) : void;
  toJSON(key: string) : object
}

export type ClustersModelDataType = {
  currentClusterId: ClusterIdType,
  clusters: Array<ClusterModelDataType>
}
