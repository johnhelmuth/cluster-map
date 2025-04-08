import slugify from "slugify";
import type {SystemIdType, SystemModelData} from '@/models/SystemModel';
import {SystemModel} from "@/models/SystemModel";
import type {DrawDirectionType, StraitModelData} from "@/models/StraitModel";
import type {BoundingBoxType, IdType} from "@/types/BasicTypes";
import type {ClusterOrientationType, MapViewStylesType} from "@/types/MapViewTypes";
import {SCHEMA_VERSION} from "@/constants";
import {StraitModel} from "@/models/StraitModel";
import {clusterParse} from "~/utils/import-validator";

// import {getBoundingBox} from "@/utils/utils";


export type ClusterIdType = IdType;

export interface ClusterModelData {
  id: ClusterIdType,
  name: string,
  systems?: Array<SystemModelData>,
  straits?: Array<StraitModelData>
}

export function isClusterModelData(data: any): data is ClusterModelData {
  return clusterParse(data).valid;
}

export class ClusterModel {

  id: ClusterIdType = '';
  name: string = '';
  systemsMap: Map<SystemIdType, SystemModel>;
  straits: Array<StraitModel>;
  _slug: string = 'unknown';

  constructor(data?: ClusterModelData) {
    this.id = '';
    this.name = '';
    this.systemsMap = new Map<SystemIdType, SystemModel>();
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

  addSystem(system: SystemModel): void {
    this.systemsMap.set(system.id, system);
  }

  connectSystems(systemA: SystemModel, systemB: SystemModel): StraitModel | undefined {
    if (!this.areConnected(systemA, systemB)) {
      const strait = new StraitModel(systemA, systemB);
      this.straits.push(strait);
      this.calculateStraitsCurveDirections();
      return strait;
    }
  }

  areConnected(systemA: SystemModel, systemB: SystemModel): boolean {
    const matches = this.straits.filter((strait) => {
      return (systemA.id == strait.systemA.id || systemA.id === strait.systemB.id)
        && (systemB.id == strait.systemA.id || systemB.id === strait.systemB.id)
    });
    return !!matches?.length;
  }

  getSystemByName(systemName: string): SystemModel | null {
    const matches = [...this.systemsMap.entries()]
      .filter(
        ([_, system]) => system.name === systemName
      );
    if (matches.length) {
      return matches[0][1];
    }
    return null;
  }

  getSystemById(systemId: SystemIdType): SystemModel | null | undefined {
    return this.systemsMap.get(systemId);
  }

  getSystemIndex(systemId: SystemIdType): number {
    return this.systems.findIndex((system: SystemModel) => system.id === systemId);
  }

  getStraitsBySystem(system: SystemModel): Array<StraitModel> {
    const straits = this.straits.filter((strait) => strait.systemA.id === system.id || strait.systemB.id === system.id);
    if (straits?.length) {
      return straits;
    }
    return [];
  }

  /**
   * Sets the direction each strait in the cluster should curve when drawn for each of the map styles.
   */
  calculateStraitsCurveDirections() {
    this.calculateStraitsCurveDirectionsLinear();
    this.calculateStraitsCurveDirectionsCircular();
    this.calculateStraitsCurveDirectionsData();
  }

  /**
   * Sets the direction each strait in the cluster should curve when drawn for the Data map style.
   *
   *   For a curve between 2 points, a and b, if you are standing at point a and looking at point b:
   *
   *     A curve moving towards b counterclockwise would move to the right of a straight line between a and b.
   *     A curve moving towards b clockwise would move to the left of a straight line between a and b.
   *
   *   Use strait lines ('center') unless it is recorded in the data for the cluster.
   */
  calculateStraitsCurveDirectionsData() {
    for (const strait of this.straits) {
      let direction = strait.getDrawDirection('data') || 'center';
      strait.setDrawDirection(direction, 'data');
    }
  }

  /**
   * Sets the direction each strait in the cluster should curve when drawn for the Circular map style.
   *
   *   For a curve between 2 points, a and b, if you are standing at point a and looking at point b:
   *
   *     A curve moving towards b counterclockwise would move to the right of a straight line between a and b.
   *     A curve moving towards b clockwise would move to the left of a straight line between a and b.
   *
   *   The curve between system A to system B in the left half of the circle from system A, should
   *   curve to the left, that is clockwise.  If system B is in the right half of the circle from system A,
   *   the line should curve to the right, which is counterclockwise.
   */
  calculateStraitsCurveDirectionsCircular() {
    for (const [systemId, straits] of this.getStraitsInSystemOrder()) {
      if (straits.length) {
        let straitIndex = 0;
        const numSystems = this.numSystems;
        const midSystemIndex = numSystems / 2;
        for (const strait of straits) {
          let direction: DrawDirectionType;
          const origSystemIndex = this.getSystemIndex(strait.systemA.id);
          const destSystemRelIndex = this.getSystemIndex(strait.systemB.id) - origSystemIndex;
          if (destSystemRelIndex <= midSystemIndex && straitIndex !== 0) {
            direction = 'clockwise'
          } else {
            direction = 'counterclockwise'
          }
          strait.setDrawDirection(direction, 'circular');
          straitIndex++;
        }
      }
    }
  }

  /**
   * Sets the direction each strait in the cluster should curve when drawn for the linear map style.
   *
   *   For a curve between 2 points, a and b, if you are standing at point a and looking at point b:
   *
   *     A curve moving towards b counterclockwise would move to the right of a straight line between a and b.
   *     A curve moving towards b clockwise would move to the left of a straight line between a and b.
   *
   *   Pick which direction a line between 2 systems should curve based on how many lines already exit
   *   on that side of the line from previous system's connections.  Clockwise lines will be to the left
   *   of a straight line, and counterclockwise will be to the right, assuming you are facing from the earlier
   *   systems to the later systems. The first connection between a system and the next system is always in the
   *   middle (or center.)
   */
  calculateStraitsCurveDirectionsLinear() {
    type DirectionCounts = {
      drawnClockwise: number,
      drawnCounterclockwise: number,
    };
    const ssIndexMap = [] as Array<DirectionCounts>;
    const emptyDrawCounts: DirectionCounts = {
      drawnClockwise: 0, drawnCounterclockwise: 0,
    };
    for (let systemIdx = 0; systemIdx < this.numSystems; systemIdx++) {
      ssIndexMap.push({...emptyDrawCounts});
    }
    const mapStyle = 'linear' as MapViewStylesType;

    let lastDrawClockwise = false;
    for (const [systemId, straits] of this.getStraitsInSystemOrder()) {
      const systemAIndex = this.getSystemIndex(systemId);
      let drawnToLeft = 0;
      let drawnToRight = 0;
      for (let currSysIdx = systemAIndex; currSysIdx < ssIndexMap.length; currSysIdx++) {
        drawnToLeft += ssIndexMap[currSysIdx].drawnClockwise;
        drawnToRight += ssIndexMap[currSysIdx].drawnCounterclockwise;
      }
      if (straits.length) {
        straits[0].setDrawDirection('center', mapStyle);
        if (straits.length > 1) {
          if (drawnToLeft < drawnToRight) {
            lastDrawClockwise = true;
          } else if (drawnToLeft > drawnToRight) {
            lastDrawClockwise = false;
          } else {
            lastDrawClockwise = !lastDrawClockwise;
          }
          straits[1].setDrawDirection(lastDrawClockwise ? 'clockwise' : 'counterclockwise', mapStyle);
          if (straits.length > 2) {
            straits[2].setDrawDirection(lastDrawClockwise ? 'clockwise' : 'counterclockwise', mapStyle);
          }
        }

        for (const strait of straits) {
          const systemBIndex = this.getSystemIndex(strait.systemB.id);
          for (let currSysIdx = systemAIndex; currSysIdx <= systemBIndex; currSysIdx++) {
            const direction = strait.getDrawDirection(mapStyle);
            if (direction === 'counterclockwise') {
              ssIndexMap[currSysIdx].drawnCounterclockwise++;
            } else if (direction === 'clockwise') {
              ssIndexMap[currSysIdx].drawnClockwise++;
            }
          }
        }
      }
    }
  }

  maxStraitRadius(mapStyle: MapViewStylesType, radius: number, direction: DrawDirectionType): number {
    let maxStraitRadius = 0;
    for (const [, straits] of this.getStraitsInSystemOrder()) {
      let straitIndex = 0;
      for (const strait of straits) {
        if (strait.getDrawDirection(mapStyle) === direction) {
          const straitRadius = strait.curveRadius(straitIndex, mapStyle, radius);
          if (straitRadius > maxStraitRadius) {
            maxStraitRadius = straitRadius;
          }
        }
        straitIndex++;
      }
    }
    return maxStraitRadius;
  }

  /**
   * @see ClusterModelInterface
   */
  getStraitsInSystemOrder(): Map<SystemIdType, Array<StraitModel>> {
    const systemStraitMap = new Map<SystemIdType, Array<StraitModel>>();
    const straitsCapturedList: Array<StraitModel> = [];
    for (const [systemId, system] of this.systemsMap) {
      const straitsBySystem = this.getStraitsBySystem(system)
        .filter((strait) => (!straitsCapturedList.includes(strait)));
      systemStraitMap.set(systemId, straitsBySystem);
      straitsCapturedList.push(...straitsBySystem);
    }
    return systemStraitMap;
  }

  getSystemsMap(): Map<SystemIdType, SystemModel> {
    return this.systemsMap;
  }

  get slug() {
    return slugify(this.name, { lower: true });
  }

  get systems(): Array<SystemModel> {
    return [...this.systemsMap.entries()].map(([key, system]) => system);
  }

  get numSystems() {
    return this.systemsMap.size;
  }

  get boundingBox(): BoundingBoxType {
    return getBoundingBox(this.systems);
  }

  /**
   * The Aspect Ratio is the ratio of the width to the height, calculated like width / height.
   *
   */
  get aspectRatio(): number {
    const {upperLeft: ul, lowerRight: lr} = this.boundingBox;
    const width = Math.abs(lr.x - ul.x);
    const height = Math.abs(lr.y - ul.y);
    if (height === 0.0) {
      return NaN;
    }
    return width / height;
  }

  get orientation(): ClusterOrientationType {
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

  importData(data: ClusterModelData) {
    this.importSystems(data);
    this.importStraits(data)
  }

  importSystems(data: ClusterModelData) {
    if ("systems" in data) {
      for (const systemData of (data?.systems || [])) {
        const system = new SystemModel(this, systemData);
      }
    }
  }

  importStraits(data: ClusterModelData) {
    if ("straits" in data && data.straits instanceof Array) {
      for (const straitData of data.straits as Array<StraitModelData>) {
        const systemA = this.getSystemById(straitData.systems[0] as SystemIdType);
        if (systemA) {
          const systemB = this.getSystemById(straitData.systems[1] as SystemIdType);
          if (systemB) {
            const strait = this.connectSystems(systemA, systemB);
            if (strait && straitData?.direction) {
              strait.setDrawDirection(straitData.direction, 'data');
            }
          }
        }
      }
      this.calculateStraitsCurveDirections();
    }
  }

  toJSON(key: string): object {
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
