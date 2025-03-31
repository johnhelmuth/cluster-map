import type {
  UniverseIdType, UniverseMetadataDataIsLoadedType,
  UniverseModelInterface,
  UniversesMetadataModelInterface
} from "~/types/ClusterTypes";

import {SCHEMA_VERSION} from "~/constants";
import {UniverseModel} from "~/models/UniverseModel";
import {
  isUniverseModelDataType,
  isUniversesMetadataDataType,
  validateUniversesMetadataDataType
} from "~/types/ClusterTypes";

export class UniversesMetadataModel implements UniversesMetadataModelInterface {

  _universesMetadata: Map<UniverseIdType, UniverseMetadataDataIsLoadedType> = new Map<UniverseIdType, UniverseMetadataDataIsLoadedType>;
  _universesCache: Map<UniverseIdType, UniverseModelInterface> = new Map;

  _currentUniverseId: UniverseIdType = 'UNKNOWN';

  _currentUniverse: UniverseModelInterface | null = null;

  constructor(universesMetadataData?: any) {
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
    if (this._currentUniverseId && this._currentUniverseId !== 'UNKNOWN') {
      if (this._currentUniverse === null) {
        const currentUniverse = await this.getUniverseById(this._currentUniverseId);
        if (currentUniverse) {
          this._currentUniverse = currentUniverse;
        }
      }
      if (this._currentUniverse) {
        return this._currentUniverse;
      }
    }
  }

  async getUniverseById(universeId: UniverseIdType) {
    if (this._universesCache.has(universeId)) {
      return this._universesCache.get(universeId);
    }
    const universeData = await $fetch(`/api/universe/${universeId}`);
    if (universeData && isUniverseModelDataType(universeData)) {
      const universe = new UniverseModel(universeData);
      this._universesCache.set(universeId, universe);
      const universeMetadata = this._universesMetadata.get(universeId)
      if (universeMetadata) {
        universeMetadata.isLoaded = true;
      }
      return universe;
    }
  }

  parseUniversesMetadata(universesMetadata: any): void {
    this._universesMetadata.clear();
    if (universesMetadata && isUniversesMetadataDataType(universesMetadata)) {
      this._currentUniverseId = universesMetadata.currentUniverseId;
      if (universesMetadata.universe instanceof UniverseModel) {
        this._currentUniverse = universesMetadata.universe;
      } else if (isUniverseModelDataType(universesMetadata.universe)) {
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
    } else {
      const validateResponse = validateUniversesMetadataDataType(universesMetadata);
      throw new Error(`Invalid UniversesMetadata passed into UniversesMetadataModel.parseUniversesMetadata() Errors: ${validateResponse.error} `);
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