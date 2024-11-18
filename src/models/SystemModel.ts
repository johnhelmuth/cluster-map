import type {AspectType, attributeValueType, MapViewStylesType} from '@/types/BasicTypes';
import {attributeValues} from '@/types/BasicTypes';
import type {StraitModelInterface} from "@/types/StraitTypes";
import type {ClusterModelInterface} from "@/types/ClusterTypes";
import type {
  SystemAttributesInterface,
  SystemAttributesKeyType,
  SystemIdType,
  SystemModelDataType,
  SystemModelInterface
} from "@/types/SystemTypes";
import {SystemAttributesDefaults} from "@/types/SystemTypes"
import type {PointType} from "@/types/GeometryTypes";
import {
  getMapDimensions,
  getPositionCircular
} from "@/utilities/ClusterGenerator";
import {SCHEMA_VERSION} from "@/constants";

export default class SystemModel implements SystemModelInterface {
  id: SystemIdType;
  name: string;
  attributes: SystemAttributesInterface;
  aspects: Array<AspectType>;
  cluster: ClusterModelInterface;
  _position: PointType;
  selected: boolean;

  /**
   * Constructor for a SystemModel.
   *
   * TODO: Generate a UUID of some type for new SystemModels with no `data.id` specified.
   * TODO: Use the ClusterModel to track names of Systems in the Cluster to ensure they are unique.
   *
   * @param cluster {ClusterModelInterface}
   * @param data {SystemModelDataType}
   */
  constructor(cluster: ClusterModelInterface, data: SystemModelDataType) {
    this.cluster = cluster;
    this.id = '';
    this.name = 'Unknown system name';
    this.attributes = {...SystemAttributesDefaults};
    this.aspects = [];
    this._position = { x: 500, y: 500 };
    this.selected = false;
    if (data) {
      this.name = data.name;
      this.constructAspects(data);
      this.constructAttributes(data);
      this.constructPosition(data);
      if ("id" in data) {
        this.id = data.id || '';
      }
    }
    this.cluster.addSystem(this as SystemModelInterface);
  }

  private constructAttributes(data: SystemModelDataType) {
    if ("attributes" in data) {
      const dataAttributes = data.attributes;
      let attrib : SystemAttributesKeyType;
      for (attrib in SystemAttributesDefaults as SystemAttributesInterface) {
        if (attrib in dataAttributes) {
          this.attributes[attrib] = dataAttributes[attrib] as attributeValueType;
        }
      }
    }
  }

  private constructAspects(data: SystemModelDataType) {
    if ("aspects" in data) {
      this.aspects = [...data.aspects];
    }
  }

  private constructPosition(data: SystemModelDataType) {
    if ("position" in data) {
      this._position = { ...data.position };
    }
  }

  get position() {
    switch (this.cluster.mapStyle) {
      case 'circular':
        return getPositionCircular(this.index, this.cluster.numSystems);
      case 'data':
      default:
        return this._position;
    }
  }

  orientatePosition(position: PointType) : PointType {
    const {center} = getMapDimensions();
    const rotationAngle = Math.PI / 2
    const transPos = { x: center.x - position.x, y: center.y - position.y };
    const x = transPos.x * Math.cos(rotationAngle) - transPos.y * Math.sin(rotationAngle) + center.x;
    const y = transPos.y * Math.cos(rotationAngle) + transPos.x * Math.sin(rotationAngle) + center.y;
    return { x, y };
  }

  get index() {
    return this.cluster.getSystemIndex(this.id);
  }

  connectTo(system: SystemModelInterface) {
    this.cluster.connectSystems(this as SystemModelInterface, system);
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

  getConnections(): Array<StraitModelInterface> {
    return this.cluster.getStraitsBySystem(this as SystemModelInterface);
  }

  getConnectedSystems(): Array<SystemModelInterface> | undefined {
    const straits = this.getConnections();
    if (straits?.length) {
      const connectedSystems = straits
        .map(strait => strait.getOtherSystem(this))
        .filter(sys => !! sys);
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
      position: this._position,
    }
  }
}
