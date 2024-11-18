import type {StraitModelInterface} from "@/types/StraitTypes";
import type {SystemModelInterface} from "@/types/SystemTypes";
import type {PointType} from "@/types/GeometryTypes";
import {SCHEMA_VERSION} from "@/constants";

export class StraitModel implements StraitModelInterface {

  systemA: SystemModelInterface;
  systemB: SystemModelInterface;

  constructor(systemA: SystemModelInterface, systemB: SystemModelInterface) {
    this.systemA = systemA;
    this.systemB = systemB;
  }

  getOtherSystem(system: SystemModelInterface): SystemModelInterface | undefined {
    if (this.systemA === system) {
      return this.systemB;
    }
    if (this.systemB === system) {
      return this.systemA;
    }
  }

  get id(): string {
    return `${this.systemA.id || 'unknown'}:${this.systemB.id || 'unknown'}`;
  }

  includes(system: SystemModelInterface): boolean {
    return (this.systemA === system || this.systemB === system);
  }

  getStraitIndex() : number {
    return this.systemA.cluster.straits.indexOf(this);
  }

  straitParameters(index : number) : { straitLength: number, straitNormalAngle: number, straitMidPoint : PointType, controlPoint: PointType } {

    const a = this.systemA.position;
    const b = this.systemB.position;
    const systemRadius = 80;

    let direction = (index % 2 === 0 ? 1 : -1); // 1: counterclockwise, -1: clockwise
    let radius = 40*index;

    const straitLength = Math.sqrt((a.x-b.x)**2 + (a.y-b.y)**2);

    const straitNormalAngle = Math.atan2(
      (a.y - b.y),
      (a.x - b.x)
    ) + direction * (Math.PI / 2); // -90 degrees, in radians

    const straitMidPoint = {
      x: (a.x + b.x)/2,
      y: (a.y + b.y)/2
    };

    const controlPoint = {
      x: Math.cos(straitNormalAngle) * radius + straitMidPoint.x,
      y: Math.sin(straitNormalAngle) * radius + straitMidPoint.y
    };

    return { straitLength, straitNormalAngle, straitMidPoint, controlPoint };
  }


  toJSON(key: string) : object {
    return {
      "type": "strait",
      schemaVersion: SCHEMA_VERSION,
      systems: [
        this.systemA.id,
        this.systemB.id
      ]
  };
  }

}
