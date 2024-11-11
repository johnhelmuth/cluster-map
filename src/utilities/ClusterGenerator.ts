
import type { ClusterIdType, ClusterModelInterface } from "@/types/ClusterTypes";
import type {SystemAttributesInterface, SystemIdType, SystemModelInterface} from "@/types/SystemTypes";
import {ClusterModel} from "@/models/ClusterModel";
import type {AspectType, attributeValueType} from "@/types/BasicTypes";
import SystemModel from "@/models/SystemModel";

function getRandomIntInclusive(min, max) {
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
  return total;
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

const floor = Math.floor;
const random = Math.random;
const cos = Math.cos;
const sin = Math.sin;

function mapDimensions() {
  const columns = 3;
  const rows = 3;
  const width = 1000;
  const height = 750;
  const cellWidth = floor(width / columns);
  const cellHeight = floor(height / rows);
  const radius = 80;
  const borderX = radius;
  const borderY = radius;
  const center: Point = {
    x: width / 2,
    y: height / 2,
  }
  return { columns, rows, width, height, cellWidth, cellHeight, radius, borderX, borderY, center };
}

function getPosition1(index: number, numPoints: number): Point {

  const {cellWidth, cellHeight, radius} = mapDimensions();

  const cX = floor(cellWidth / 2);
  const cY = floor (cellHeight / 2)

  const col = index % 3;
  const row = floor(index / 3);
  const jitterX = floor(radius / 4)
  const jitterY = floor(radius / 4)

  return {
    x: cellWidth * col + cX + floor(random() * jitterX),
    y: cellHeight * row + cY + floor(random() * jitterY),
  }
}

function getPosition2(index: number, numPoints: number) : Point {
  const {width, height, radius, borderX, borderY} = mapDimensions();

  const randWidth = floor(width - 2*borderX);
  const randHeight = floor(height - 2*borderY);

  const x = getRandomIntInclusive(borderX, randWidth);
  const y = getRandomIntInclusive(borderY, randHeight);

  return {x, y}
}

function getPosition3(index: number, numPoints: number) : Point {
  const {width, height, borderX, borderY, center} = mapDimensions();
  console.log({width, height, borderX, borderY, center});

  const systemsRadius = Math.min(width, height)/2 - Math.min(borderX, borderY);

  const angle = (numPoints - index) * (Math.PI*2)/numPoints

  const x = cos(angle) * systemsRadius + center.x;
  const y = sin(angle) * systemsRadius + center.y;

  console.log(systemsRadius, angle, x, y)
  return {x, y}
}

function getPosition(index: number, numPoints: number): Point {
  return getPosition3(index, numPoints);
}

export default function createCluster(id: ClusterIdType, name: string, numberSystems?: number) {

  if (! id) {
    id = getRandomIntInclusive(1000,9999).toString(16)
  }
  if (! name) {
    name = `Cluster ${id}`;
  }
  const newCluster = new ClusterModel({id, name});

  const systemsData: Array<{id: string, name: string, attributes: SystemAttributesInterface}> = [];
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

  // const system = new SystemModel(newCluster, {id, name: name, attributes});
  console.log('createCluster() newCluster', newCluster);
  console.log('createCluster() newCluster.straits.length: ', newCluster.straits.length);
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
  console.log(grandTotal, otherGrandTotal, histogram);
}
