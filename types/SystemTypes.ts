import type {attributeValueType, IdType, AspectType, MapViewStylesType} from "@/types/BasicTypes";
import type {StraitModelInterface} from "@/types/StraitTypes";
import type {ClusterModelInterface} from "@/types/ClusterTypes";
import type { PointType } from "@/types/GeometryTypes";

/**
 * System model types
 *
 * A System is a star system.
 */
export interface SystemAttributesInterface {
  technology: attributeValueType;
  environment: attributeValueType;
  resources: attributeValueType;
}

export type SystemAttributesKeyType = keyof SystemAttributesInterface;

export const SystemAttributesDefaults: SystemAttributesInterface = {
  technology: 0 as attributeValueType,
  environment: 0 as attributeValueType,
  resources: 0 as attributeValueType
}

export type SystemIdType = IdType;

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

export type SystemModelDataType = Omit<SystemModelInterface,"cluster"> | (Pick<SystemModelInterface, "name"> & Partial<Pick<SystemModelInterface, "id">>);

