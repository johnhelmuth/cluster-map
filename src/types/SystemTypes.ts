import type { attributeValueType, IdType, AspectType} from "@/types/BasicTypes";
import type {StraitModelInterface} from "@/types/StraitTypes";
import type {ClusterModelInterface} from "@/types/ClusterTypes";

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
  attributes: SystemAttributesInterface;
  aspects: Array<AspectType>;
  cluster: ClusterModelInterface;

  connectTo(system: SystemModelInterface) : void;
  setName(name: string) : string;
  setAttribute(attribute: keyof SystemAttributesInterface, value: attributeValueType) : void;
  setAspect(index: number, aspect: AspectType) : AspectType;
  addAspect(aspect: AspectType) : Number;
  getConnections(): Array<StraitModelInterface>;
  getConnectedSystems(): Array<SystemModelInterface>;
}

export type SystemModelDataType = Omit<SystemModelInterface,"cluster"> | (Pick<SystemModelInterface, "name"> & Partial<Pick<SystemModelInterface, "id">>);

