
import type { SystemIdType, SystemModelInterface } from '@/types/SystemTypes';
import type {StraitModelDataType, StraitModelInterface} from '@/types/StraitTypes';
import type { ClusterModelInterface, ClusterIdType, ClusterModelDataType } from "@/types/ClusterTypes";
import SystemModel from "@/models/SystemModel";
import {StraitModel} from "@/models/StraitModel";
import type {BoundingBoxType, ClusterOrientationType} from "@/types/BasicTypes";
import {SCHEMA_VERSION} from "@/constants";
// import {getBoundingBox} from "@/utils/utils";

export class ClusterModel implements ClusterModelInterface {

  id: ClusterIdType = '';
  name: string = '';
  systemsMap: Map<SystemIdType, SystemModelInterface>;
  straits: Array<StraitModelInterface>;

  constructor(data?: ClusterModelDataType) {
    this.id = '';
    this.name = '';
    this.systemsMap = new Map<SystemIdType, SystemModelInterface>();
    this.straits = [];
    if (data) {
      this.importData(data);
      if ("id" in data) {
        this.id = data.id || '';
      }
      this.name = data.name;
    } else {
      this.id = '';
      this.name = 'Unknown cluster name';
    }
  }

  addSystem(system: SystemModelInterface): void {
    this.systemsMap.set(system.id, system);
  }

  connectSystems(systemA: SystemModelInterface, systemB: SystemModelInterface) : void {
    if (! this.areConnected(systemA, systemB)) {
      const strait = new StraitModel(systemA, systemB);
      this.straits.push(strait);
    }
  }

  areConnected(systemA: SystemModelInterface, systemB: SystemModelInterface) : boolean {
    const matches = this.straits.filter((strait) => {
      return (systemA.id == strait.systemA.id || systemA.id === strait.systemB.id)
            && (systemB.id == strait.systemA.id || systemB.id === strait.systemB.id)
    });
    return !! matches?.length;
  }

  getSystemByName(systemName: string) : SystemModelInterface | null {
    const matches = [...this.systemsMap.entries()]
      .filter(
        ([_, system]) => system.name === systemName
      );
    if (matches.length) {
      return matches[0][1];
    }
    return null;
  }

  getSystemById(systemId: SystemIdType) : SystemModelInterface | null | undefined {
    return this.systemsMap.get(systemId);
  }

  getSystemIndex(systemId: SystemIdType) : number {
    return this.systems.findIndex((system: SystemModelInterface) => system.id === systemId);
  }

  getStraitsBySystem(system: SystemModelInterface) : Array<StraitModelInterface> {
    const straits = this.straits.filter((strait) => strait.systemA.id === system.id || strait.systemB.id === system.id);
    if (straits?.length) {
      return straits;
    }
    return [];
  }

  /**
   * @see ClusterModelInterface
   */
  getStraitsInSystemOrder() : Map<SystemIdType, Array<StraitModelInterface>> {
    const systemStraitMap = new Map<SystemIdType, Array<StraitModelInterface>>();
    const straitsCapturedList : Array<StraitModelInterface> = [];
    for (const [systemId, system] of this.systemsMap) {
      const straitsBySystem = this.getStraitsBySystem(system)
        .filter((strait) => (!straitsCapturedList.includes(strait)));
      systemStraitMap.set(systemId, straitsBySystem);
      straitsCapturedList.push(...straitsBySystem);
    }
    return systemStraitMap;
  }

  getSystemsMap() : Map<SystemIdType, SystemModelInterface> {
    return this.systemsMap;
  }

  get systems() : Array<SystemModelInterface> {
    return [...this.systemsMap.entries()].map(([key, system]) => system);
  }

  get numSystems() {
    return this.systemsMap.size;
  }

  get boundingBox() : BoundingBoxType {
    return getBoundingBox(this.systems);
  }

  /**
   * The Aspect Ratio is the ratio of the width to the height, calculated like width / height.
   *
   */
  get aspectRatio() : number {
    const { upperLeft: ul, lowerRight: lr} = this.boundingBox;
    const width = Math.abs(lr.x - ul.x);
    const height = Math.abs(lr.y - ul.y);
    if (height === 0.0) {
      return NaN;
    }
    return width / height;
  }

  get orientation() : ClusterOrientationType {
    if (isNaN(this.aspectRatio)) {
      return 'square'; // Who knows?
    }
    if (this.aspectRatio >= 0.9 && 1.1 >= this.aspectRatio) {
      return 'square';
    } else if (this.aspectRatio < 0.9) {
      return 'portrait';
    }
    return 'landscape';
  }

  importData(data: ClusterModelDataType) {
    this.importSystems(data);
    this.importStraits(data)
  }

  importSystems(data: ClusterModelDataType) {
    if ("systems" in data) {
      for (const systemData of (data?.systems || [])) {
        const system = new SystemModel(this, systemData);
      }
    }
  }

  importStraits(data: ClusterModelDataType) {
    if ("straits" in data && data.straits instanceof Array) {
      for (const straitData of data.straits as Array<StraitModelDataType>) {
        const systemA = this.getSystemById(straitData.systems[0] as SystemIdType);
        if (systemA) {
          const systemB = this.getSystemById(straitData.systems[1] as SystemIdType);
          if (systemB) {
            this.connectSystems(systemA, systemB);
          }
        }
      }
    }
  }

  toJSON(key: string) : object {
    return {
      type: "cluster",
      schemaVersion: SCHEMA_VERSION,
      id: this.id,
      name: this.name,
      systems: this.systems,
      straits: this.straits,
    }
  }
}
