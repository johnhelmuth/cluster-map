
import type { AspectType, attributeValueType } from '@/types/BasicTypes';
import { attributeValues } from '@/types/BasicTypes';
import type { StraitModelInterface } from "@/types/StraitTypes";
import type { ClusterModelInterface } from "@/types/ClusterTypes";
import type {
  SystemIdType,
  SystemAttributesInterface,
  SystemModelInterface,
  SystemModelDataType
} from "@/types/SystemTypes";
import {SystemAttributesDefaults} from "@/types/SystemTypes"

export default class SystemModel implements SystemModelInterface {
  id: SystemIdType;
  name: string;
  attributes: SystemAttributesInterface;
  aspects: Array<AspectType>;
  cluster: ClusterModelInterface;

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
    if (data) {
      this.name = data.name;
      this.constructAspects(data);
      this.constructAttributes(data);
      if ("id" in data) {
        this.id = data.id || '';
      }
    }
    this.cluster.addSystem(this);
  }

  constructAttributes(data: SystemModelDataType) {
    if ("attributes" in data) {
      const dataAttributes = data.attributes;
      for (const attrib in SystemAttributesDefaults) {
        if (attrib in dataAttributes) {
          this.attributes[attrib] = dataAttributes[attrib] as attributeValueType;
        }
      }
    }
  }

  constructAspects(data: SystemModelDataType) {
    if ("aspects" in data) {
      this.aspects = [...data.aspects];
    }
  }

  connectTo(system: SystemModelInterface) {
    this.cluster.connectSystems(this, system);
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
    return this.cluster.getConnectionsForSystem(this);
  }

  getConnectedSystems(): Array<SystemModelInterface> {
    const straits = this.getConnections();
    if (straits?.length) {
      return straits.map(strait => {
        if (strait.systemA.id === this.id) {
          return strait.systemB;
        }
        if (strait.systemB.id === this.id) {
          return strait.systemA;
        }
      }).filter(sys => sys);
    }
    return [];
  }
}
