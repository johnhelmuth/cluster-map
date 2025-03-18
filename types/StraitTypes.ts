import { z } from 'zod';

import type {SystemModelInterface} from "@/types/SystemTypes";
import type {PointType} from "@/types/GeometryTypes";
import type {MapViewStylesType} from "@/types/BasicTypes";
import {SystemIdZSchema} from "@/types/SystemTypes";
import {PointZSchema} from "@/types/GeometryTypes";

export const DrawDirectionZSchema = z.enum(['clockwise', 'center', 'counterclockwise'])
export type DrawDirectionType = z.infer<typeof DrawDirectionZSchema>;

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

  straitParameters(index : number, mapStyle: MapViewStylesType, rotate: boolean, radius : number) : {
    straitLength: number,
    straitNormalAngle: number,
    straitMidPoint : PointType,
    quadControlPoint: PointType,
    cubicControlPoint1: PointType,
    cubicControlPoint2: PointType,
    pathType: 'arc' | 'curved',
    curveRadius: number,
  };

  /**
   * Calculated by ClusterModel when cluster is complete, never stored. (For now.)
   *
   * @param direction {DrawDirectionType}
   * @param mapStyle {MapViewStylesType}
   */
  setDrawDirection(direction: DrawDirectionType, mapStyle: MapViewStylesType): void;
  getDrawDirection(mapStyle: MapViewStylesType) : DrawDirectionType;
  curveRadius(index: number, mapStyle: MapViewStylesType, radius: number) : number;

  toJSON(key: string) : object;
}

export const StraitModelDataZSchema = z.object({
  systems: z.array(SystemIdZSchema).length(2),
  direction: DrawDirectionZSchema.optional(),
});

export type StraitModelDataType = z.infer<typeof StraitModelDataZSchema>;
