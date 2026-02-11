/**
 * Cluster model types
 *
 * A Cluster is a set of star systems and how they are connected via FTL straits.
 *
 * The SystemModelInterface includes a StraitModelInterface shaped object for each of the systems it connects to.
 * These StraitModelInterface objects are shared between the 2 SystemModelInterface objects it connects.
 */
import type {BoundingBoxType, ClusterOrientationType, IdType, MapViewStylesType} from "@/types/BasicTypes";
import type { SystemIdType, SystemModelInterface, SystemModelDataType} from "@/types/SystemTypes";
import type {DrawDirectionType, StraitModelInterface, StraitModelDataType} from "@/types/StraitTypes";

export type ClusterIdType = IdType;

export interface ClusterModelInterface {
  id: ClusterIdType;
  name: string;
  systemsMap: Map<SystemIdType, SystemModelInterface>;
  systems: Array<SystemModelInterface>;
  straits: Array<StraitModelInterface>;
  numSystems: number;
  boundingBox: BoundingBoxType;
  aspectRatio: number;
  orientation: ClusterOrientationType;
  slug: string;

  getSystemByName(systemName: string) : SystemModelInterface | null;

  getSystemById(systemId: SystemIdType) : SystemModelInterface | null | undefined;

  getSystemIndex(systemId: SystemIdType) : number;

  getSystemsMap() : Map<SystemIdType, SystemModelInterface>;

  addSystem(system: SystemModelInterface): void;

  connectSystems(systemA: SystemModelInterface, systemB: SystemModelInterface) : StraitModelInterface|undefined;

  areConnected(systemA: SystemModelInterface, systemB: SystemModelInterface) : boolean

  getStraitsBySystem(system: SystemModelInterface) : Array<StraitModelInterface>;

  /**
   * Gets the straits in cluster in order of the systems.
   *
   * @returns Map<SystemIdType, Array<StraitModelInterface>>
   */
  getStraitsInSystemOrder() : Map<SystemIdType, Array<StraitModelInterface>>;


  maxStraitRadius(mapStyle: MapViewStylesType, radius: number, direction: DrawDirectionType) : number;

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
  getClusterBySlugOrId(slugOrId: string) : ClusterModelInterface | undefined
  selectClusterById(id: ClusterIdType): void;
  selectClusterByName(name: string) : void;
  toJSON(key: string) : object
}

export type ClustersModelDataType = {
  currentClusterId: ClusterIdType,
  clusters: Array<ClusterModelDataType>
}
