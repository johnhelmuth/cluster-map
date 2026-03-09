/**
 * Cluster model types
 *
 * A Cluster is a set of star systems and how they are connected via FTL straits.
 *
 * The SystemModelInterface includes a StraitModelInterface shaped object for each of the systems it connects to.
 * These StraitModelInterface objects are shared between the 2 SystemModelInterface objects it connects.
 */
import type {ClusterOrientationType, IdType, MapViewStylesType} from "@/types/BasicTypes";
import {type BoundingBoxType } from '@/utils/geometry';
import type { SystemIdType, SystemModelInterface} from "@/types/SystemTypes";
import type {DrawDirectionType, StraitModelInterface, StraitPointDataType} from "@/types/StraitTypes";
import type {SystemModelDataType} from "@/types/SystemTypes";
import type {StraitModelDataType} from "@/types/StraitTypes";

export type ClusterIdType = IdType;

/**
 * GalacticDirectionType
 *
 * The direction within the galaxy a cluster strait will lead the traveler
 * when moving from strait point 1 to strait point 2.
 *
 * The directions are Coreward, Rimward, Spinward, and Counterspinward, usually
 * oriented up, down, right, left, respectively, when rendered on a display or
 * a map.
 */
export type GalacticDirectionType = 'coreward' | 'rimward' | 'spinward' | 'counterspinward';
export const galacticDirectionOpposites = {
  coreward: 'rimward',
  spinward: 'counterspinward',
  rimward: 'coreward',
  counterspinward: 'spinward',
}
export const DEFAULT_GALACTIC_DIRECTION = 'coreward';

export interface ClusterModelInterface {
  id: ClusterIdType;
  name: string;
  systemsMap: Map<SystemIdType, SystemModelInterface>;
  systems: Array<SystemModelInterface>;
  straits: Array<StraitModelInterface>;
  clusters?: ClustersModelInterface;
  numSystems: number;
  boundingBox: BoundingBoxType;
  aspectRatio: number;
  orientation: ClusterOrientationType;
  slug: string;

  hasClusterStraits(): boolean;

  getClusterStraits(): Array<StraitModelInterface>

  getSystemByName(systemName: string) : SystemModelInterface | null;

  getSystemById(systemId: SystemIdType) : SystemModelInterface | undefined;

  getSystemIndex(systemId: SystemIdType) : number;

  getSystemsMap() : Map<SystemIdType, SystemModelInterface>;

  addSystem(system: SystemModelInterface): void;

  connectSystems(systemA: SystemModelInterface, systemB: SystemModelInterface) : StraitModelInterface|undefined;

  areConnected(systemA: SystemModelInterface, systemB: SystemModelInterface) : boolean

  getStraitsBySystem(system: SystemModelInterface) : Array<StraitModelInterface>;

  /**
   * Gets the straits in cluster in order of the systems. Exclude Cluster Straits.
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
        straits?: Array<StraitModelDataType> | null
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
  getClusterStraitsByCluster(cluster: ClusterModelInterface): Array<StraitModelInterface>;
  getSystemByStraitPointId(straitPoint: StraitPointDataType): SystemModelInterface | undefined;
  areConnected(systemA: SystemModelInterface, systemB: SystemModelInterface) : boolean;
  hasClusterStraits(cluster: ClusterModelInterface): boolean;
  getClusterStraits(): Array<StraitModelInterface>;
  clusterIsInStrait(cluster: ClusterModelInterface, strait: StraitModelInterface): boolean;
  saveClusterStraitForPostImport(cluster: ClusterModelInterface, straitData: StraitModelDataType): void;
  toJSON(key: string) : object
}

export type ClustersModelDataType = {
  currentClusterId: ClusterIdType,
  clusters: Array<ClusterModelDataType>,
}
