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

    _currentUniverseId: UniverseIdType = 'UNKNOWN';

    _currentUniverse: UniverseModelInterface | null = null;

    constructor(universesMetadataData?: UniversesMetadataDataType) {
        if (universesMetadataData) {
            this.parseUniversesMetadata(universesMetadataData);
        }
    }

    get universesMetadata() {
        return [...this._universesMetadata.values()];
    }

    get universe(): UniverseModelInterface | null {
        return this._currentUniverse || null;
    }

    hasCurrentUniverse(): boolean {
        return !!(this._currentUniverseId && this._currentUniverse && this._currentUniverseId === this._currentUniverse.id);
    }

    async setCurrentUniverse(universeId: UniverseIdType): Promise<boolean> {
        if (! this._universesMetadata.has(universeId)) {
            return false;
        }
        this._currentUniverseId = universeId;
        this._currentUniverse = null;
        await this.getCurrentUniverse();
        return true;
    }

    async getCurrentUniverse() {
        console.log('UniversesMetadataModel.getCurrentUniverse() this._currentUniverseId: ', this._currentUniverseId);
        if (this._currentUniverseId) {
            if (this._currentUniverse === null) {
                const currentUniverse = await this.getUniverseById(this._currentUniverseId);
                if (currentUniverse) {
                    this._currentUniverse = currentUniverse;
                }
            }
            console.log('UniversesMetadataModel.getCurrentUniverse() this._currentUniverse: ', this._currentUniverse);
            if (this._currentUniverse) {
                return this._currentUniverse;
            }
        }
    }

    async getUniverseById(universeId: UniverseIdType) {
        console.log('UniversesMetadataModel.getUniverseById() universeId: ', universeId);
        console.log('UniversesMetadataModel.getUniverseById() this._universesCache.has(universeId): ', this._universesCache.has(universeId));
        if (this._universesCache.has(universeId)) {
            return this._universesCache.get(universeId);
        }
        const universeData = await $fetch(`/api/universe/${universeId}`);
        console.log('UniversesMetadataModel.getUniverseById() universeData: ', universeData);
        if (universeData && validateUniverseData(universeData)) {
            const universe = new UniverseModel(universeData);
            this._universesCache.set(universeId, universe);
            const universeMetadata = this._universesMetadata.get(universeId)
            if (universeMetadata) {
                universeMetadata.isLoaded = true;
            }
            console.log('UniversesMetadataModel.getUniverseById() this._universesCache: ', this._universesCache);
            console.log('UniversesMetadataModel.getUniverseById() this._universesMetadata: ', this._universesMetadata);
            return universe;
        }
    }

    parseUniversesMetadata(universesMetadata: UniversesMetadataDataType): void {
        this._universesMetadata.clear();
        if (universesMetadata) {
            this._currentUniverseId = universesMetadata.currentUniverseId;
            if (universesMetadata.universe instanceof UniverseModel) {
                this._currentUniverse = universesMetadata.universe;
            } else if (validateUniverseData(universesMetadata.universe)) {
                this._currentUniverse = new UniverseModel(universesMetadata.universe);
            }
            if (this._currentUniverse) {
                this._universesCache.set(this._currentUniverseId, this._currentUniverse);
            }
            if (universesMetadata?.currentUniverseId === undefined) {
                throw new Error('No currentUniverseId value.');
            }
            if (universesMetadata?.universesMetadata?.length > 0) {
                for (const universeMetadata of universesMetadata?.universesMetadata) {
                    if (universeMetadata?.id) {
                        const universeMetadataLoaded = {
                            ...universeMetadata,
                            isLoaded: false,
                        }
                        if (universeMetadata.id === this._currentUniverse?.id) {
                            universeMetadataLoaded.isLoaded = true;
                        }
                        this._universesMetadata.set(universeMetadata.id, universeMetadataLoaded);
                    }
                }
            }
            if (! this._universesMetadata.has(this._currentUniverseId)) {
                throw new Error('No universesMetadata loaded for currentUniverseId.');
            }
        }
    }

    toJSON(key: string): object {
        return {
            type: "universes",
            schemaVersion: SCHEMA_VERSION,
            currentUniverseId: this._currentUniverseId || '',
            universe: this.universe,
            universesMetadata: [...this._universesMetadata.values()]
        };
    }
}
