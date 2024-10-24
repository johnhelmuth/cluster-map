import type {SystemIdType, SystemModelInterface} from "@/types/SystemTypes";

/**
 * Strait model types
 *
 * A Strait is a path that an FTL drive can follow between star systems.
 */

export interface StraitModelInterface {
  systemA: SystemModelInterface;
  systemB: SystemModelInterface;

  get id(): string;

  getOtherSystem(system: SystemModelInterface): SystemModelInterface | undefined;

  includes(system: SystemModelInterface): boolean;

  toJSON(key: string) : Array<string>;
}

export type StraitModelDataType = [SystemIdType, SystemIdType];
