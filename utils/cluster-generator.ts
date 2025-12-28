
import type {SystemAttributesInterface, SystemIdType, SystemModelData} from "@/models/SystemModel"
import {isSystemAttributes, SystemAttributesDefaults, SystemModel} from "@/models/SystemModel"
import {type ClusterIdType, ClusterModel} from "@/models/ClusterModel";
import type { attributeValueType } from "@/types/BasicTypes";
import {
  type ClusterOrientationType,
  MAP_VIEW_STYLES_DEFAULT,
  type MapViewStylesType
} from "@/types/MapViewTypes";
import type {PointType} from "@/types/GeometryTypes.js";

export function getRandomIntInclusive(min: number, max: number) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // The maximum is inclusive and the minimum is inclusive
}

export function rollDice(): attributeValueType {
  let total = 0;
  for (let i = 0; i < 4; i++) {
    const diceRoll = getRandomIntInclusive(-1, 1);
    total += diceRoll;
  }
  return total as attributeValueType;
}

function slipstreamGuarantee(systems: Array<SystemModelData>) {
  const {implementGuarantee, lowestIndex, highestIndex} =
    systems.reduce((res, system, index) => {
      if (! isSystemAttributes(system.attributes)) {
        system.attributes = SystemAttributesDefaults;
      }
      const { technology, environment, resources } = system.attributes;
      const totalAttributes = technology + environment + resources;
      if (totalAttributes < res.minAttributes) {
        res.minAttributes = totalAttributes;
        res.lowestIndex = index;
      }
      if (totalAttributes > res.maxAttributes) {
        res.maxAttributes = totalAttributes;
        res.highestIndex = index;
      }
      if (system.attributes.technology >= 2) {
        res.implementGuarantee = false;
      }
      return res;
    }, {
      implementGuarantee: true,
      lowestIndex: -1,
      highestIndex: -1,
      minAttributes: Number.MAX_SAFE_INTEGER,
      maxAttributes: -Number.MAX_SAFE_INTEGER
    });
  if (implementGuarantee && lowestIndex >= 0 && lowestIndex < systems.length && highestIndex >= 0 && highestIndex < systems.length) {
    const lowestSystem = systems[lowestIndex];
    const highestSystem = systems[highestIndex];
    if (isSystemAttributes(lowestSystem.attributes)) {
      lowestSystem.attributes.technology = 2;
    }
    if (isSystemAttributes(highestSystem.attributes)) {
      highestSystem.attributes.technology = 2;
    }
  }
}

function getNextOpenSystem(index: number, cluster: ClusterModelInterface): SystemModelInterface | undefined{
  for (let i = index; i < cluster.systems.length; i++ ) {
    if (cluster.systems[i].getConnections().length === 0) {
      return cluster.systems[i];
    }
  }
}

const { floor, random, cos, sin, PI, max, min } = Math;

const systemSizeMap = {
  data: [
    { threshold: Number.MAX_SAFE_INTEGER, radius: 80},
  ],
  circular: [
    { threshold: 8, radius: 80 },
    { threshold: 10, radius: 70 },
    { threshold: 15, radius: 40 },
    { threshold: Number.MAX_SAFE_INTEGER, radius: 20},
  ],
  linear: [
    { threshold: 3, radius: 80 },
    { threshold: 6, radius: 50 },
    { threshold: 11, radius: 30 },
    { threshold: 15, radius: 20 },
    { threshold: Number.MAX_SAFE_INTEGER, radius: 10},
  ],
};

export function systemRadiusByStyleAndNumberOfSystems(mapStyle: MapViewStylesType | undefined, numSystems: number): number {
  const {baseRadius} = getMapDimensions();
  for (const {threshold, radius} of systemSizeMap[mapStyle || MAP_VIEW_STYLES_DEFAULT]) {
    if (numSystems <= threshold) {
      return radius;
    }
  }
  return baseRadius;
}

export function getMapDimensions() {

  const width = 1000;
  const height = 750;
  const baseRadius = 80;
  const borderX = baseRadius;
  const borderY = baseRadius;
  const center: PointType = {
    x: width / 2,
    y: height / 2,
  }
  // noinspection JSSuspiciousNameCombination
  const centerPortrait = {
    x: center.y,
    y: center.x,
  };
  return { width, height, baseRadius, borderX, borderY, center, centerPortrait };
}

export function circularGraphSystemsRadius(): number {
  const {width, height, borderX, borderY} = getMapDimensions();
  return calcCircularGraphSystemsRadius(width, height, borderX, borderY);
}

function calcCircularGraphSystemsRadius(width: number, height: number, borderX: number, borderY: number): number {
  return Math.min(width, height)/2 - Math.min(borderX, borderY)
}

export function getPositionCircular(index: number, numPoints: number, rotate = false) : PointType {
  const {width, height, borderX, borderY, center, centerPortrait} = getMapDimensions();

  const systemsRadius = calcCircularGraphSystemsRadius(width, height, borderX, borderY);

  const angle = (numPoints - index) * (Math.PI*2)/numPoints

  const translateDiff = ! rotate ? { x: 0, y: 0 } : { x: center.x - centerPortrait.x, y: center.y - centerPortrait.y };

  const x = cos(angle) * systemsRadius + center.x - translateDiff.x;
  const y = sin(angle) * systemsRadius + center.y - translateDiff.y;

  return {x, y}
}

/**
 * Get the position of a system on a linear style map.
 *
 * @param index {number} - The index of the system to be mapped, 0 to numPoints - 1.
 * @param numPoints {number} - The total number of systems to be mapped.
 */
export function getPositionLinear(index: number, numPoints: number, rotate = false) : PointType {

  const {width, height, borderX, borderY, center} = getMapDimensions();

  let x, y;
  const perSystem = (width / numPoints);

  if (! rotate) {

    x = (perSystem / 2 + index * perSystem);
    y = center.y;

  } else {

    // noinspection JSSuspiciousNameCombination
    x = center.y;
    y = (perSystem / 2 + index * perSystem);
  }

  return {x, y}
}

/**
 * Get a default position for a new system in a new cluster.
 *
 * @param index {number} - The index of the system to be mapped, 0 to numPoints - 1.
 * @param numPoints {number} - The total number of systems to be mapped.
 * @param orientation {ClusterOrientationType} - which way the map is oriented.
 */
function getPosition(index: number, numSystems: number, orientation = 'square' as ClusterOrientationType): PointType {
  return getPositionCircular(index, numSystems);
}

export function createCluster(id: ClusterIdType, name: string, numberSystems: number = 9) {

  if (! id) {
    id = getRandomIntInclusive(1000,9999).toString(16)
  }
  if (! name) {
    name = `Cluster ${id}`;
  }
  const newCluster = new ClusterModel({id, name});

  const systemsData: Array<SystemModelData> = [];
  for (let i = 0; i < numberSystems; i++) {
    const id: SystemIdType = String.fromCharCode(65+i ) + (1024 + floor(random() * 1024)).toString(16);
    const name: string = "System " + (i*10 + floor(random()*10)).toString();
    const attributes: SystemAttributesInterface = {
      technology: rollDice(),
      environment: rollDice(),
      resources: rollDice(),
    };
    const position = getPosition(i, numberSystems);
    systemsData.push({ id, name, attributes, position });
  }

  slipstreamGuarantee(systemsData);

  const systems: SystemModel[] = systemsData.map((systemData) => new SystemModel(newCluster, systemData));

  for (const [index, system] of systems.entries()) {
    if (index < systems.length-1) {
      const strait = newCluster.connectSystems(system, systems[index+1]);
      strait?.setDrawDirection('center', 'data');
    } else {
      break;
    }
    const connectionsRoll = rollDice();
    if (connectionsRoll >= 0) {
      const nextSystemToLink = getNextOpenSystem(index+1, newCluster);
      if (nextSystemToLink && connectionsRoll >= 0) {
        const strait = newCluster.connectSystems(system, nextSystemToLink);
        strait?.setDrawDirection('center', 'data');
      }
    }
    if (connectionsRoll > 0) {
      const nextSystemToLink = getNextOpenSystem(index+1, newCluster);
      if (nextSystemToLink) {
        const strait = newCluster.connectSystems(system, nextSystemToLink);
        strait?.setDrawDirection('center', 'data');
      }
    }
  }
  return newCluster;
}

function testRollDice() {

  const histogram = new Map<number, number>([
    [-4, 0],
    [-3, 0],
    [-2, 0],
    [-1, 0],
    [0, 0],
    [1, 0],
    [2, 0],
    [3, 0],
    [4, 0],
  ]);
  let grandTotal = 0;
  for (let i = 0; i < 1000000; i++) {
    const roll = rollDice();
    const resultCount = histogram.get(roll) as number + 1;
    histogram.set(roll, resultCount);
    grandTotal += roll;
  }
  let otherGrandTotal = 0;
  for (const [roll, count] of histogram.entries()) {
    otherGrandTotal += (roll * count);
  }
}
