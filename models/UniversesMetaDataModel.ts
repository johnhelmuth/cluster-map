import type {
    UniverseIdType, UniverseMetaDataIsLoadedType, UniverseMetaDataType,
    UniverseModelInterface, UniversesMetaDataType,
    UniversesModelDataType,
    UniversesMetaDataModelInterface
} from "~/types/ClusterTypes";

import {SCHEMA_VERSION} from "~/constants";

export class UniversesMetaDataModel implements UniversesMetaDataModelInterface {

    _universesMetadata: Map<UniverseIdType, UniverseMetaDataIsLoadedType> = new Map<UniverseIdType, UniverseMetaDataIsLoadedType>;
    currentUniverseId: UniverseIdType = null;

    logLabel: string = '';

    constructor(universesData: UniversesModelDataType) {
        this.logLabel = import.meta.client ? 'CLIENT: ' : 'SERVER: ';
        console.log(`${this.logLabel}UniversesMetaDataModel.constructor() universesData: `, universesData);
        if (universesData) {
            this.parseUniversesMetaData(universesData)
        }
    }

    get universesMetaData() {
        return [...this._universesMetadata.values()];
    }

    async getCurrentUniverse() {
        if (this.currentUniverseId) {
            return this.getUniverseById(this.currentUniverseId);
        }
    }

    async getUniverseById(universeId: UniverseIdType) {
        const universe = await $fetch<UniverseModelInterface>(`/api/universe/${universeId}`);
        console.log(`${this.logLabel}UniversesMetaDataModel.getUniverseById(${universeId}) universe: `, universe);
        return universe;
    }

    parseUniversesMetaData(universesData: UniversesModelDataType) {
        this._universesMetadata.clear();
        console.log(`${this.logLabel}UniversesMetaDataModel.parseUniversesMetaData() universesData: `, universesData)
        if (universesData) {
            if (universesData?.universesMetaData?.length > 0) {
                for (const universeMetaData of universesData?.universesMetaData) {
                    if (universeMetaData?.id) {
                        this._universesMetadata.set(universeMetaData.id, {...universeMetaData, isLoaded: false});
                    }
                }
            }
            console.log(`${this.logLabel}UniversesMetaDataModel.parseUniversesMetaData() this._universesMetadata: `, this._universesMetadata)
            if (universesData?.currentUniverseId === undefined || !this._universesMetadata.has(universesData.currentUniverseId)) {
                throw new Error('No currentUniverseId value or metadata not found.');
            }
            this.currentUniverseId = universesData.currentUniverseId;
        }
    }

    toJSON(key: string): object {
        return {
            type: "universes",
            schemaVersion: SCHEMA_VERSION,
            currentUniverseId: this.currentUniverseId || '',
            universesMetaData: [...this._universesMetadata.values()]
        };
    }
}
