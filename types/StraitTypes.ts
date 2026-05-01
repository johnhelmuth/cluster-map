import type {SystemIdType, SystemModelInterface} from "@/types/SystemTypes";
import type {LineDetailsType, PointType} from "@/utils/geometry";
import type {MapViewStylesType} from "@/types/BasicTypes";
import type {ClusterIdType, ClusterModelInterface, GalacticDirectionType} from "~/types/ClusterTypes";

export type DrawDirectionType = 'clockwise' | 'center' | 'counterclockwise';
export const DrawDirectionList = [
  'clockwise' as DrawDirectionType,
  'center' as DrawDirectionType,
  'counterclockwise' as DrawDirectionType
];

/**
 * Strait model types
 *
 * A Strait is a path that an FTL drive can follow between star systems.
 */

/* A strait point is one end of a strait, and exists in a system in a cluster. */
export interface StraitPointInterface {
  cluster: ClusterModelInterface;
  system: SystemModelInterface;
}

export type StraitPointDataType = {
  clusterId: ClusterIdType,
  systemId: SystemIdType,
}

export type StraitParametersType = {
  length: number,
  midPoint: PointType,
  curveRadius: number,
  pathType: 'arc' | 'curved',
  quadControlPoint?: PointType,
  cubicControlPoint1?: PointType,
  cubicControlPoint2?: PointType,
};

/* A strait is a line between two strait points, and has a galactic direction and a curve direction. */
export interface StraitModelInterface {
  straitPointA: StraitPointInterface;
  straitPointB: StraitPointInterface;
  galacticDirection?: GalacticDirectionType;

  get id(): string;

  getOtherSystem(system: SystemModelInterface): SystemModelInterface | undefined;

  getOtherCluster(cluster: ClusterModelInterface): ClusterModelInterface | undefined;

  straitOriginInCluster(cluster: ClusterModelInterface): boolean;

  includes(system: SystemModelInterface): boolean;

  getStraitIndex(): number;

  isClusterStrait(): boolean;

  getStraitPointInCluster(cluster: ClusterModelInterface): StraitPointInterface | undefined;

  getOtherStraitPoint(straitPoint: StraitPointInterface): StraitPointInterface;

  straitLine(mapStyle: MapViewStylesType, rotate: boolean, direction: DrawDirectionType): LineDetailsType;

  /**
   * Calculated by ClusterModel when cluster is complete, never stored. (For now.)
   *
   * @param direction {DrawDirectionType}
   * @param mapStyle {MapViewStylesType}
   */
  setDrawDirection(direction: DrawDirectionType, mapStyle: MapViewStylesType): void;

  getDrawDirection(mapStyle: MapViewStylesType): DrawDirectionType;

  curveRadius(index: number, mapStyle: MapViewStylesType, radius: number): number;

  setGalacticDirection(direction: GalacticDirectionType): void;

  toJSON(key: string): object;
}

export type StraitModelDataType = {
  straitPointA: StraitPointDataType,
  straitPointB: StraitPointDataType,
  direction?: DrawDirectionType,
  galacticDirection?: GalacticDirectionType
};
