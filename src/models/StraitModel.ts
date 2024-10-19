import type {StraitModelInterface} from "@/types/StraitTypes";
import type {SystemModelInterface} from "@/types/SystemTypes";

export class StraitModel implements StraitModelInterface {

  systemA: SystemModelInterface;
  systemB: SystemModelInterface;

  constructor(systemA: SystemModelInterface, systemB: SystemModelInterface) {
    this.systemA = systemA;
    this.systemB = systemB;
  }

}
