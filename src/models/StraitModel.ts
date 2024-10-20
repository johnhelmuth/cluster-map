import type {StraitModelInterface} from "@/types/StraitTypes";
import type {SystemModelInterface} from "@/types/SystemTypes";

export class StraitModel implements StraitModelInterface {

  systemA: SystemModelInterface;
  systemB: SystemModelInterface;

  constructor(systemA: SystemModelInterface, systemB: SystemModelInterface) {
    this.systemA = systemA;
    this.systemB = systemB;
  }

  getOtherSystem(system: SystemModelInterface): StraitModelInterface | undefined {
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

}
