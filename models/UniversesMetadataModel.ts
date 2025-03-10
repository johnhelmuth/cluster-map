import type {
    UniverseIdType, UniverseMetadataIsLoadedType,
    UniverseModelInterface,
    UniversesMetadataDataType,
    UniversesMetadataModelInterface
} from "~/types/ClusterTypes";

import {SCHEMA_VERSION} from "~/constants";
import {UniverseModel} from "~/models/UniverseModel";
import {validateUniverseData} from "~/utils/import-validator";

export class UniversesMetadataModel implements UniversesMetadataModelInterface {

    _universesMetadata: Map<UniverseIdType, UniverseMetadataIsLoadedType> = new Map<UniverseIdType, UniverseMetadataIsLoadedType>;
    _universesCache: Map<UniverseIdType, UniverseModelInterface> = new Map;

    currentUniverseId: UniverseIdType = 'UNKNOWN';

    logLabel: string = '';

    constructor(universesMetadataData: UniversesMetadataDataType) {
        this.logLabel = import.meta.client ? 'CLIENT: ' : 'SERVER: ';
        if (universesMetadataData) {
            this.parseUniversesMetadata(universesMetadataData)
        }
    }

    get universesMetadata() {
        return [...this._universesMetadata.values()];
    }

    async getCurrentUniverse() {
        if (this.currentUniverseId) {
            return this.getUniverseById(this.currentUniverseId);
        }
    }

    async getUniverseById(universeId: UniverseIdType) {
        if (this._universesCache.has(universeId)) {
            return this._universesCache.get(universeId);
        }
        const universeData = await $fetch(`/api/universe/${universeId}`);
        if (universeData && validateUniverseData(universeData)) {
            const universe = new UniverseModel(universeData);
            this._universesCache.set(universeId, universe);
            return universe;
        }
    }

    parseUniversesMetadata(universesMetadata: UniversesMetadataDataType): void {
        this._universesMetadata.clear();
        if (universesMetadata) {
            if (universesMetadata?.universesMetadata?.length > 0) {
                for (const universeMetadata of universesMetadata?.universesMetadata) {
                    if (universeMetadata?.id) {
                        this._universesMetadata.set(universeMetadata.id, {...universeMetadata, isLoaded: false});
                    }
                }
            }
            if (universesMetadata?.currentUniverseId === undefined || !this._universesMetadata.has(universesMetadata.currentUniverseId)) {
                throw new Error('No currentUniverseId value or metadata not found.');
            }
            this.currentUniverseId = universesMetadata.currentUniverseId;
        }
    }

    toJSON(key: string): object {
        return {
            type: "universes",
            schemaVersion: SCHEMA_VERSION,
            currentUniverseId: this.currentUniverseId || '',
            universesMetadata: [...this._universesMetadata.values()]
        };
    }
}
