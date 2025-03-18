import { z } from 'zod';
import type {attributeValueType, IdType, AspectType, MapViewStylesType} from "@/types/BasicTypes";
import {AspectZSchema, AttributeValueZSchema, IdZSchema} from "@/types/BasicTypes";
import type {StraitModelInterface} from "@/types/StraitTypes";
import type {ClusterModelInterface} from "@/types/ClusterTypes";
import type { PointType } from "@/types/GeometryTypes";
import {PointZSchema} from "@/types/GeometryTypes";

/**
 * System model types
 *
 * A System is a star system.
 */
export const SystemAttributesZSchema = z.object({
  technology: AttributeValueZSchema,
  environment: AttributeValueZSchema,
  resources: AttributeValueZSchema,
});
export type SystemAttributesInterface = z.infer<typeof SystemAttributesZSchema>;

export type SystemAttributesKeyType = keyof SystemAttributesInterface;

export const SystemAttributesDefaults: SystemAttributesInterface = {
  technology: 0 as attributeValueType,
  environment: 0 as attributeValueType,
  resources: 0 as attributeValueType
}

export const SystemIdZSchema = IdZSchema;
export type SystemIdType = z.infer<typeof SystemIdZSchema>;
export interface SystemModelInterface {
  id: SystemIdType;
  name: string;
  url: string;
  attributes: SystemAttributesInterface;
  aspects: Array<AspectType>;
  cluster: ClusterModelInterface;
  position: PointType;
  selected: boolean;
  index: number;

  connectTo(system: SystemModelInterface) : void;
  setName(name: string) : string;
  setAttribute(attribute: keyof SystemAttributesInterface, value: attributeValueType) : void;
  setAspect(index: number, aspect: AspectType) : AspectType;
  addAspect(aspect: AspectType) : Number;
  getPosition(mapStyle: MapViewStylesType | undefined, rotate: boolean) : PointType;
  getConnections(): Array<StraitModelInterface>;
  getConnectedSystems(): Array<SystemModelInterface> | undefined;
  getSelected(): boolean;
  toggleSelected(): void;

  toJSON(key: string): object;
}

export const SystemModelDataZSchema = z.object({
  id: SystemIdZSchema,
  name: z.string(),
  url: z.string().optional(),
  attributes: SystemAttributesZSchema.optional(),
  aspects: z.array(AspectZSchema).optional(),
  position: PointZSchema.optional(),
  selected: z.boolean().optional(),
  index: z.number().nonnegative().optional(),
});

export type SystemModelDataType = z.infer<typeof SystemModelDataZSchema>;

