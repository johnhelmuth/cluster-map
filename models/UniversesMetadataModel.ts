import type {
    UniverseIdType, UniverseMetadataIsLoadedType,
    UniverseModelInterface,
    UniversesMetadataDataType,
    UniversesMetadataModelInterface
} from "~/types/ClusterTypes";

import {SCHEMA_VERSION} from "~/constants";

export class UniversesMetadataModel implements UniversesMetadataModelInterface {

    _universesMetadata: Map<UniverseIdType, UniverseMetadataIsLoadedType> = new Map<UniverseIdType, UniverseMetadataIsLoadedType>;
    currentUniverseId: UniverseIdType = 'UNKNOWN';

    logLabel: string = '';

    constructor(universesMetadataData: UniversesMetadataDataType) {
        this.logLabel = import.meta.client ? 'CLIENT: ' : 'SERVER: ';
        console.log(`${this.logLabel}UniversesMetaDataModel.constructor() universesData: `, universesMetadataData);
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
        const universe = await $fetch(`/api/universe/${universeId}`);
        console.log(`${this.logLabel}UniversesMetaDataModel.getUniverseById(${universeId}) universe: `, universe);
        return universe;
    }

    parseUniversesMetadata(universesMetadata: UniversesMetadataDataType): void {
        this._universesMetadata.clear();
        console.log(`${this.logLabel}UniversesMetaDataModel.parseUniversesMetaData() universesMetadata: `, universesMetadata)
        if (universesMetadata) {
            console.log(`${this.logLabel}UniversesMetaDataModel.parseUniversesMetaData() universesMetadata?.universesMetadata: `, universesMetadata?.universesMetadata)
            console.log(`${this.logLabel}UniversesMetaDataModel.parseUniversesMetaData() universesMetadata?.universesMetadata?.length: `, universesMetadata?.universesMetadata?.length)
            if (universesMetadata?.universesMetadata?.length > 0) {
                for (const universeMetadata of universesMetadata?.universesMetadata) {
                    console.log(`${this.logLabel}UniversesMetaDataModel.parseUniversesMetaData() universeMetadata: `, universeMetadata)
                    if (universeMetadata?.id) {
                        this._universesMetadata.set(universeMetadata.id, {...universeMetadata, isLoaded: false});
                    }
                }
            }
            console.log(`${this.logLabel}UniversesMetaDataModel.parseUniversesMetaData() this._universesMetadata: `, this._universesMetadata)
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
