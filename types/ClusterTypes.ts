/**
 * Cluster model types
 *
 * A Cluster is a set of star systems and how they are connected via FTL straits.
 *
 * The SystemModelInterface includes a StraitModelInterface shaped object for each of the systems it connects to.
 * These StraitModelInterface objects are shared between the 2 SystemModelInterface objects it connects.
 */
import type {BoundingBoxType, ClusterOrientationType, IdType, MapViewStylesType} from "@/types/BasicTypes";
import type {SystemIdType, SystemModelInterface} from "@/types/SystemTypes";
import type {DrawDirectionType, StraitModelInterface} from "@/types/StraitTypes";
import type {SystemModelDataType} from "@/types/SystemTypes";
import type {StraitModelDataType} from "@/types/StraitTypes";


export type ClusterIdType = IdType;

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

    connectSystems(systemA: SystemModelInterface, systemB: SystemModelInterface): StraitModelInterface|undefined;

    areConnected(systemA: SystemModelInterface, systemB: SystemModelInterface): boolean

    getStraitsBySystem(system: SystemModelInterface): Array<StraitModelInterface>;

    /**
     * Gets the straits in cluster in order of the systems.
     *
     * @returns Map<SystemIdType, Array<StraitModelInterface>>
     */
    getStraitsInSystemOrder(): Map<SystemIdType, Array<StraitModelInterface>>;

    importSystems(data: ClusterModelDataType): void;

    importStraits(data: ClusterModelDataType): void;

    maxStraitRadius(mapStyle: MapViewStylesType, radius: number, direction: DrawDirectionType) : number;

    toJSON(key: string): object;
}

export type ClusterModelDataType = ClusterModelInterface |
    (Pick<ClusterModelInterface, "name">
        & Partial<Pick<ClusterModelInterface, "id">>
        & {
            systems?: Array<SystemModelDataType> | null,
            straits?: Array<StraitModelDataType> | Array<Array<SystemIdType>> | null
          }
    );

export type UniverseIdType = IdType;

export interface UniverseModelInterface {
    id: UniverseIdType,
    description: string,
    cluster: ClusterModelInterface | undefined;
    clusters: Array<ClusterModelInterface>;

    parseUniverseData(universeData: {} | undefined): void;

    addCluster(cluster: ClusterModelInterface): void;

    getClusterById(id: ClusterIdType): ClusterModelInterface | undefined;

    getClusterByName(name: string): ClusterModelInterface | undefined;

    selectClusterById(id: ClusterIdType): void;

    selectClusterByName(name: string): void;

    toJSON(key: string): object
}

export type UniverseModelDataType = {
    id: UniverseIdType,
    description: string,
    currentClusterId: ClusterIdType,
    clusters: Array<ClusterModelDataType>
}

export type UniversesMetadataModelInterface = {

    currentUniverseId: UniverseIdType;
    universesMetaData: Array<UniverseMetadataIsLoadedType>;

    getCurrentUniverse(): Promise<UniverseModelInterface | undefined>;
    getUniverseById(universeId: UniverseIdType): Promise<UniverseModelInterface | undefined>;

    parseUniversesMetadata(universesData: UniversesMetadataDataType): void;

    toJSON(key: string): object
}

export type UniversesMetadataDataType = {
    currentUniverseId: UniverseIdType;
    universesMetadata: Array<UniverseMetadataIsLoadedType>;
}

export type UniverseMetadataType = {
    id: UniverseIdType,
    description: string
}

export type UniverseMetadataIsLoadedType = UniverseMetadataType & {
    isLoaded: boolean;
}




