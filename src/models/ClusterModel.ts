
import type { SystemIdType, SystemModelInterface } from '@/types/SystemTypes';
import type { StraitModelInterface } from '@/types/StraitTypes';
import type { ClusterModelInterface, ClusterIdType, ClusterModelDataType } from "@/types/ClusterTypes";
import SystemModel from "@/models/SystemModel";
import {StraitModel} from "@/models/StraitModel";
import type {SystemModelDataType} from "@/types/SystemTypes";
import type {StraitModelDataType} from "@/types/StraitTypes";

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

  getConnectionsForSystem(system: SystemModelInterface) : Array<StraitModelInterface> {
    const straits = this.straits.filter((strait) => strait.systemA.id === system.id || strait.systemB.id === system.id);
    if (straits?.length) {
      return straits;
    }
    return [];
  }

  getSystemsMap() : Map<SystemIdType, SystemModelInterface> {
    return this.systemsMap;
  }

  get systems() : Array<SystemModelInterface> {
    return [...this.systemsMap.entries()].map(([key, system]) => system);
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
    if ("straits" in data && data.straits instanceof Array)
    for (const straitData of data.straits as Array<Array<SystemIdType>>) {
      const systemA = this.getSystemById(straitData[0] as SystemIdType);
      if (systemA) {
        const systemB = this.getSystemById(straitData[1] as SystemIdType);
        if (systemB) {
          this.connectSystems(systemA, systemB);
        }
      }
    }
  }
}
