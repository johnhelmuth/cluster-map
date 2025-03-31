/**
 * Cluster model types
 *
 * A Cluster is a set of star systems and how they are connected via FTL straits.
 *
 * The SystemModelInterface includes a StraitModelInterface shaped object for each of the systems it connects to.
 * These StraitModelInterface objects are shared between the 2 SystemModelInterface objects it connects.
 */
import type {BoundingBoxType, ClusterOrientationType, IdType, MapViewStylesType} from "@/types/BasicTypes";
import {IdZSchema} from "@/types/BasicTypes";
import type {SystemIdType, SystemModelInterface} from "@/types/SystemTypes";
import {SystemModelDataZSchema} from "@/types/SystemTypes";
import type {DrawDirectionType, StraitModelInterface} from "@/types/StraitTypes";
import {StraitModelDataZSchema} from "@/types/StraitTypes";
import {z} from "zod";


export type ClusterIdType = IdType;
export const ClusterIdTypeZSchema = IdZSchema;

export interface ClusterModelInterface {
  id: ClusterIdType;
  name: string;
  systemsMap: Map<SystemIdType, SystemModelInterface>;
  systems: Array<SystemModelInterface>;
  straits: Array<StraitModelInterface>;
  numSystems: number;
  boundingBox: BoundingBoxType;
  aspectRatio: number;
  orientation: ClusterOrientationType;

  getSystemByName(systemName: string): SystemModelInterface | null;

  getSystemById(systemId: SystemIdType): SystemModelInterface | null | undefined;

  getSystemIndex(systemId: SystemIdType): number;

  getSystemsMap(): Map<SystemIdType, SystemModelInterface>;

  addSystem(system: SystemModelInterface): void;

  connectSystems(systemA: SystemModelInterface, systemB: SystemModelInterface): StraitModelInterface | undefined;

  areConnected(systemA: SystemModelInterface, systemB: SystemModelInterface): boolean

  getStraitsBySystem(system: SystemModelInterface): Array<StraitModelInterface>;

  /**
   * Gets the straits in cluster in order of the systems.
   *
   * @returns Map<SystemIdType, Array<StraitModelInterface>>
   */
  getStraitsInSystemOrder(): Map<SystemIdType, Array<StraitModelInterface>>;


  maxStraitRadius(mapStyle: MapViewStylesType, radius: number, direction: DrawDirectionType): number;

  importSystems(data: ClusterModelDataType): void;

  importStraits(data: ClusterModelDataType): void;

  toJSON(key: string): object;
}

export const ClusterModelDataZSchema = z.object({
  id: ClusterIdTypeZSchema,
  name: z.string(),
  systems: z.array(SystemModelDataZSchema).optional(),
  straits: z.array(StraitModelDataZSchema).optional(),
});

export type ClusterModelDataType = z.infer<typeof ClusterModelDataZSchema>;

export function isClusterModelDataType(data: any): data is ClusterModelDataType {
  return ClusterModelDataZSchema.safeParse(data).success;
}

export type UniverseIdType = IdType;
export const UniverseIdTypeZSchema = IdZSchema;

export interface UniverseModelInterface {
  id: UniverseIdType,
  description: string,
  cluster: ClusterModelInterface | undefined;
  clusters: Array<ClusterModelInterface>;

  parseUniverseData(clustersData: any): void;

  addCluster(cluster: ClusterModelInterface): void;

  getClusterById(id: ClusterIdType): ClusterModelInterface | undefined;

  getClusterByName(name: string): ClusterModelInterface | undefined;

  selectClusterById(id: ClusterIdType): void;

  selectClusterByName(name: string): void;

  toJSON(key: string): object
}

export const UniverseModelDataZSchema = z.object({
  id: UniverseIdTypeZSchema,
  description: z.string(),
  currentClusterId: ClusterIdTypeZSchema,
  clusters: z.array(ClusterModelDataZSchema)
})

export type UniverseModelDataType = z.infer<typeof UniverseModelDataZSchema>;

export function isUniverseModelDataType(data: any): data is UniverseModelDataType {
  return UniverseModelDataZSchema.safeParse(data).success;
}

export const UniverseMetadataDataZSchema = z.object({
  id: UniverseIdTypeZSchema,
  description: z.string(),
})

export type UniverseMetadataDataType = z.infer<typeof UniverseMetadataDataZSchema>;

export const UniverseMetadataDataIsLoadedZSchema = UniverseMetadataDataZSchema.extend({
  isLoaded: z.boolean(),
})

export type UniverseMetadataDataIsLoadedType = z.infer<typeof UniverseMetadataDataIsLoadedZSchema>;


export const UniversesMetadataDataZSchema = z.object({
  currentUniverseId: UniverseIdTypeZSchema,
  universe: UniverseModelDataZSchema.optional().nullable(),
  universesMetadata: z.array(UniverseMetadataDataZSchema),
});

export type UniversesMetadataDataType = z.infer<typeof UniversesMetadataDataZSchema>;

export function isUniversesMetadataDataType(data: any): data is UniversesMetadataDataType {
  return UniversesMetadataDataZSchema.safeParse(data).success;
}

export function validateUniversesMetadataDataType(data: any) {
  return UniversesMetadataDataZSchema.safeParse(data);
}

export type UniversesMetadataModelInterface = {

  universesMetadata: Array<UniverseMetadataDataIsLoadedType>;
  universe: UniverseModelInterface | null;

  getCurrentUniverse(): Promise<UniverseModelInterface | undefined>;
  getUniverseById(universeId: UniverseIdType): Promise<UniverseModelInterface | undefined>;

  hasCurrentUniverse(): boolean;

  setCurrentUniverse(universeId: UniverseIdType): void;

  parseUniversesMetadata(universesData: UniversesMetadataDataType): void;

  toJSON(key: string): object
}

