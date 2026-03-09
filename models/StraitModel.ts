import type {
  DrawDirectionType,
  StraitModelInterface,
  StraitParametersType,
  StraitPointInterface
} from "@/types/StraitTypes";
import type {SystemModelInterface} from "@/types/SystemTypes";
import {lineDetails} from "@/utils/geometry";
import {SCHEMA_VERSION} from "@/constants";
import type {MapViewStylesType} from "@/types/BasicTypes";
import {circularGraphSystemsRadius} from '@/utils/cluster-generator';
import type {ClusterModelInterface, GalacticDirectionType} from "~/types/ClusterTypes";

export class StraitModel implements StraitModelInterface {

  straitPointA: StraitPointInterface;
  straitPointB: StraitPointInterface;
  galacticDirection?: GalacticDirectionType;

  _drawDirections: { [K in MapViewStylesType]: DrawDirectionType };

  constructor(systemA: SystemModelInterface, systemB: SystemModelInterface, galacticDirection?: GalacticDirectionType) {
    this.straitPointA = {
      cluster: systemA.cluster,
      system: systemA
    };
    this.straitPointB = {
      cluster: systemB.cluster,
      system: systemB
    };
    this.galacticDirection = galacticDirection;
    this._drawDirections = {
      'data': 'center',
      'circular': 'center',
      'linear': 'center',
    }
  }

  getOtherSystem(system: SystemModelInterface): SystemModelInterface | undefined {
    if (this.straitPointA.system === system) {
      return this.straitPointB.system;
    }
    if (this.straitPointB.system === system) {
      return this.straitPointA.system;
    }
  }

  isClusterStrait() {
    return (this.straitPointA.cluster.id !== this.straitPointB.cluster.id);
  }

  getStraitPointInCluster(cluster: ClusterModelInterface) {
    if (this.straitPointA.cluster.id === cluster.id)
      return this.straitPointA;
    else if (this.straitPointB.cluster.id === cluster.id) {
      return this.straitPointB;
    }
  }

  get id(): string {
    const {cluster: clusterA, system: systemA} = this.straitPointA;
    const {cluster: clusterB, system: systemB} = this.straitPointB;
    return `${clusterA.id || 'unknown'}:${systemA.id || 'unknown'}:${clusterB.id || 'unknown'}:${systemB.id || 'unknown'}`;
  }

  includes(system: SystemModelInterface): boolean {
    return (this.straitPointA.system === system || this.straitPointB.system === system);
  }

  getStraitIndex(): number {
    return this.straitPointA.cluster.straits.indexOf(this);
  }

  straitLine(mapStyle: MapViewStylesType, rotate: boolean): LineDetailsType {

    const a = this.straitPointA.system.getPosition(mapStyle, rotate);
    const b = this.straitPointB.system.getPosition(mapStyle, rotate);

    return lineDetails(a, b);
  }

  curveRadius(index: number, mapStyle: MapViewStylesType, radius: number): number {
    const indexFactor = radius;
    let curveRadius;
    switch (mapStyle) {
      case 'data':
        curveRadius = radius;
        break;
      case 'circular':
        const systemsRadius = circularGraphSystemsRadius();
        if (index === 0) {
          curveRadius = systemsRadius; // radius * 1.25;
        } else {
          curveRadius = radius;
        }
        break;
      case 'linear':
        curveRadius = radius + index * indexFactor + (index - 1) * (indexFactor);
        break;
      default:
        curveRadius = radius;
    }
    return curveRadius;
  }

  setDrawDirection(direction: DrawDirectionType, mapStyle: MapViewStylesType): void {
    this._drawDirections[mapStyle] = direction;
  }

  getDrawDirection(mapStyle: MapViewStylesType): DrawDirectionType {
    return this._drawDirections[mapStyle];
  }

  setGalacticDirection(direction: GalacticDirectionType) {
    this.galacticDirection = direction;
  }

  toJSON(key: string): object {
    return {
      "type": "strait",
      schemaVersion: SCHEMA_VERSION,
      straitPointA: {
        clusterId: this.straitPointA.cluster.id,
        systemId: this.straitPointA.system.id
      },
      straitPointB: {
        clusterId: this.straitPointB.cluster.id,
        systemId: this.straitPointB.system.id
      },
      direction: this.getDrawDirection('data'),
      galacticDirection: this.galacticDirection
    };
  }

}
