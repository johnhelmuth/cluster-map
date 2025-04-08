import type {AspectType, attributeValueType, IdType} from '@/types/BasicTypes';
import type {MapViewStylesType} from '@/types/MapViewTypes';
import {attributeValues} from '@/types/BasicTypes';
import type {PointType} from "@/types/GeometryTypes";
import {
  getPositionCircular, getPositionLinear
} from "~/utils/cluster-generator";
import { rotatePosition } from "~/utils/utils";
import {SCHEMA_VERSION} from "@/constants";
import {isPointType} from "@/types/GeometryTypes";
import type {StraitModel} from "~/models/StraitModel";
import type {ClusterModel} from "~/models/ClusterModel";
import {straitParse, systemParse} from "~/utils/import-validator";

/**
 * System Attributes types
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

export function attributeIsInRange(attrValue : number) {
  return (attrValue >= -4 && attrValue <= 4);
}
export function isSystemAttributes(attributes: SystemAttributesInterface | undefined): attributes is SystemAttributesInterface {
  if (! attributes) {
    return false;
  }
  if (! attributes?.hasOwnProperty("technology") || typeof attributes.technology !== "number" || ! attributeIsInRange(attributes.technology)) {
    return false;
  }
  if (! attributes?.hasOwnProperty("environment") || typeof attributes.environment !== "number" || ! attributeIsInRange(attributes.environment)) {
    return false;
  }
  if (! attributes?.hasOwnProperty("resources") || typeof attributes.resources !== "number" || ! attributeIsInRange(attributes.resources)) {
    return false;
  }
  return true;
}

/**
 * SystemIdType
 */
export type SystemIdType = IdType;

/**
 * System Model Data types
 */
export interface SystemModelData {
  id: SystemIdType;
  name: string;
  url?: string;
  attributes?: SystemAttributesInterface;
  aspects?: Array<AspectType>;
  position?: PointType;
}

export function isSystemModelData(data: any) : data is SystemModelData {
  return systemParse(data).valid;
}

/*
 * SystemModel class
 *
 * Encapsulates the business logic of what a System is and how it relates to other components.
 */
export class SystemModel implements SystemModelData {
  id: SystemIdType;
  name: string;
  url: string;
  attributes: SystemAttributesInterface;
  aspects: Array<AspectType>;
  position: PointType;

  cluster: ClusterModel;
  selected: boolean;

  /**
   * Constructor for a SystemModel.
   *
   * TODO: Generate a UUID of some type for new SystemModels with no `data.id` specified.
   * TODO: Use the ClusterModel to track names of Systems in the Cluster to ensure they are unique.
   *
   * @param cluster {ClusterModel}
   * @param data {SystemModelData}
   */
  constructor(cluster: ClusterModel, data: SystemModelData) {
    this.cluster = cluster;
    this.id = '';
    this.name = 'Unknown system name';
    this.url = '';
    this.attributes = {...SystemAttributesDefaults};
    this.aspects = [];
    this.position = { x: 500, y: 500 };
    this.selected = false;
    if (data) {
      this.name = data.name;
      this.constructAspects(data);
      this.constructAttributes(data);
      this.constructPosition(data);
      if ("id" in data) {
        this.id = data.id || '';
      }
      if ("url" in data) {
        this.url = data.url || '';
      }
    }
    this.cluster.addSystem(this as SystemModel);
  }

  private constructAttributes(data: SystemModelData) {
    if ("attributes" in data && isSystemAttributes(data.attributes)) {
      const dataAttributes = data.attributes;
      let attrib : SystemAttributesKeyType;
      for (attrib in SystemAttributesDefaults as SystemAttributesInterface) {
        if (attrib in dataAttributes) {
          this.attributes[attrib] = dataAttributes[attrib] as attributeValueType;
        }
      }
    }
  }

  private constructAspects(data: SystemModelData) {
    if ("aspects" in data) {
      this.aspects = [...(data.aspects || [])];
    }
  }

  private constructPosition(data: SystemModelData) {
    if ("position" in data && isPointType(data.position)) {
      this.position = { ...data.position };
    }
  }

  get index() {
    return this.cluster.getSystemIndex(this.id);
  }

  getPosition(mapStyle: MapViewStylesType | undefined, rotate: boolean) : PointType {
    switch (mapStyle) {
      case 'circular':
        return getPositionCircular(this.index, this.cluster.numSystems, rotate);
      case 'linear':
        return getPositionLinear(this.index, this.cluster.numSystems, rotate);
      case 'data':
      default:
        return rotate ? rotatePosition(this.position) : this.position;
    }
  }

  connectTo(system: SystemModel) {
    this.cluster.connectSystems(this as SystemModel, system);
  }

  setName(name: string) : string {
    this.name = name;
    return this.name;
  }

  setAttribute(attribute: keyof SystemAttributesInterface, value: attributeValueType) : void {
    if (! attributeValues.includes(value)) {
      throw new Error('Invalid system attribute value. Valid values are ' + attributeValues.join(',') + ', value supplied was "' + value + '"');
    }
    this.attributes[attribute] = value;
  }

  setAspect(index: number, aspect: AspectType) : AspectType {
    if (0 <= index && index < this.aspects.length) {
      this.aspects[index] = aspect;
    }
    return this.aspects[index] || '';
  }

  addAspect(aspect: AspectType) : Number {
    this.aspects.push(aspect);
    return this.aspects.length-1;
  }

  getConnections(): Array<StraitModel> {
    return this.cluster.getStraitsBySystem(this);
  }

  getConnectedSystems(): Array<SystemModel> | undefined {
    const straits = this.getConnections();
    if (straits?.length) {
      const connectedSystems = straits
        .map(strait => strait.getOtherSystem(this))
        .filter(sys => !! sys) as Array<SystemModel>;
      if (!! connectedSystems && connectedSystems instanceof Array) {
        return connectedSystems;
      }
    }
    return [];
  }

  getSelected(): boolean {
    return this.selected;
  }

  toggleSelected(): void {
    this.selected = ! this.selected;
  }

  toJSON(key: string) : object {
    return {
      "type": "system",
      schemaVersion: SCHEMA_VERSION,
      id: this.id,
      name: this.name,
      attributes: this.attributes,
      aspects: this.aspects,
      position: this.position,
    }
  }
}
