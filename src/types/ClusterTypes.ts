/**
 * Cluster model types
 *
 * A Cluster is a set of star systems and how they are connected via FTL straits.
 *
 * The SystemModelInterface includes a StraitModelInterface shaped object for each of the systems it connects to.
 * These StraitModelInterface objects are shared between the 2 SystemModelInterface objects it connects.
 */
import type { IdType} from "@/types/BasicTypes";
import type { SystemIdType, SystemModelInterface} from "@/types/SystemTypes";
import type {StraitModelInterface} from "@/types/StraitTypes";
import {SystemModelDataType} from "@/types/SystemTypes";
import {StraitModelDataType} from "@/types/StraitTypes";


export type ClusterIdType = IdType;

export interface ClusterModelInterface {
  id: ClusterIdType;
  name: string;
  systems: Map<SystemIdType, SystemModelInterface>;
  straits: Array<StraitModelInterface>;

  getSystemByName(systemName: string) : SystemModelInterface | null;

  getSystemById(systemId: SystemIdType) : SystemModelInterface | null | undefined;

  getSystemsMap() : Map<SystemIdType, SystemModelInterface>;

  getSystems() : Array<SystemModelInterface>;

  addSystem(system: SystemModelInterface): void;

  connectSystems(systemA: SystemModelInterface, systemB: SystemModelInterface) : void;

  areConnected(systemA: SystemModelInterface, systemB: SystemModelInterface) : boolean

  getConnectionsForSystem(system: SystemModelInterface) : Array<StraitModelInterface>;

  importSystems(data: ClusterModelDataType) ;
  importStraits(data: ClusterModelDataType);

}

export type ClusterModelDataType = ClusterModelInterface |
  (Pick<ClusterModelInterface, "name">
    & Partial<Pick<ClusterModelInterface, "id">>
    & {
        systems?: Array<SystemModelDataType> | null,
        straits?: Array<StraitModelDataType> | null
      }
  );
