
import type { ClusterIdType, ClusterModelInterface } from "@/types/ClusterTypes";
import type {SystemAttributesInterface, SystemIdType, SystemModelInterface} from "@/types/SystemTypes";
import {ClusterModel} from "@/models/ClusterModel";
import {type attributeValueType, MAP_VIEW_STYLES_DEFAULT, type MapViewStylesType} from "@/types/BasicTypes";
import SystemModel from "@/models/SystemModel";
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

function slipstreamGuarantee(systems: Array<{id: string, name: string, attributes: SystemAttributesInterface}>) {
  const {implementGuarantee, lowestIndex, highestIndex} =
    systems.reduce((res, system, index) => {
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
  if (implementGuarantee && lowestIndex > 0 && lowestIndex < systems.length && highestIndex > 0 && highestIndex < systems.length) {
    systems[lowestIndex].attributes.technology = 2;
    systems[highestIndex].attributes.technology = 2;
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
    { threshold: 6, radius: 80 },
    { threshold: 10, radius: 25 },
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
  return { width, height, baseRadius, borderX, borderY, center };
}

export function getPositionCircular(index: number, numPoints: number) : PointType {
  const {width, height, borderX, borderY, center} = getMapDimensions();

  const systemsRadius = Math.min(width, height)/2 - Math.min(borderX, borderY);

  const angle = (numPoints - index) * (Math.PI*2)/numPoints

  const x = cos(angle) * systemsRadius + center.x;
  const y = sin(angle) * systemsRadius + center.y;

  return {x, y}
}

// TODO: get this to work reasonably. Punch it into SystemModel.position() getter to work on it.
// export function getPositionLinear(index: number, numPoints: number) : PointType {
//
//   const {width, height, borderX, borderY, center} = getMapDimensions();
//
//   const radius = systemRadiusByStyleAndNumberOfSystems('linear', numPoints);
//
//   const perSystem = (width - borderX) / numPoints;
//
//   const x = borderX/2 + index * (max(perSystem, radius));
//   const y = center.y;
//
//   return {x, y}
// }

function getPosition(index: number, numSystems: number): PointType {
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

  const systemsData: Array<{id: string, name: string, attributes: SystemAttributesInterface, position: PointType}> = [];
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

  const systems: SystemModelInterface[] = systemsData.map((systemData) => new SystemModel(newCluster, systemData));

  for (const [index, system] of systems.entries()) {
    if (index < systems.length-1) {
      newCluster.connectSystems(system, systems[index+1]);
    } else {
      break;
    }
    const connectionsRoll = rollDice();
    if (connectionsRoll >= 0) {
      const nextSystemToLink = getNextOpenSystem(index+1, newCluster);
      if (nextSystemToLink && connectionsRoll >= 0) {
        newCluster.connectSystems(system, nextSystemToLink);
      }
    }
    if (connectionsRoll > 0) {
      const nextSystemToLink = getNextOpenSystem(index+1, newCluster);
      if (nextSystemToLink && connectionsRoll > 0) {
        newCluster.connectSystems(system, nextSystemToLink);
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
