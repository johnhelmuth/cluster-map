import type {SystemIdType, SystemModelInterface} from "@/types/SystemTypes";
import type {PointType} from "@/types/GeometryTypes";
import type {MapViewStylesType} from "@/types/BasicTypes";

/**
 * Strait model types
 *
 * A Strait is a path that an FTL drive can follow between star systems.
 */

export interface StraitModelInterface {
  systemA: SystemModelInterface;
  systemB: SystemModelInterface;

  get id(): string;

  getOtherSystem(system: SystemModelInterface): SystemModelInterface | undefined;

  includes(system: SystemModelInterface): boolean;

  getStraitIndex() : number;

  straitParameters(index : number, mapStyle: MapViewStylesType) : { straitLength: number, straitNormalAngle: number, straitMidPoint : PointType, controlPoint: PointType };

  toJSON(key: string) : object;
}

export type StraitModelDataType = {
  systems: Array<SystemIdType>
};
