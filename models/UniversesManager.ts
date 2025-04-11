
import {createSchemaValidationError, universeMetadataParse, universeParse} from "~/utils/import-validator";
import type {UniverseIdType, UniverseModelData} from "~/models/UniverseModel";
import {isUniverseModelData, UniverseModel} from "~/models/UniverseModel";
import type {IdType} from "~/types/BasicTypes";

export interface UniverseMetadataData {
  id: UniverseIdType;
  name: string;
}
export type UniversesMetadata = Array<UniverseMetadataData>;

export interface UniverseMetadataDataStatus extends UniverseMetadataData {
  isLoaded: boolean;
}

export function isUniverseMetadataData(data: any) : data is UniverseMetadataData {
  return universeMetadataParse(data).valid;
}

export function isUniverseMetadataDataStatus(data: any) : data is UniverseMetadataDataStatus {
  return universeMetadataParse(data).valid && typeof data?.isLoaded === "boolean";
}

export function isUniversesMetadata(data: any) : data is UniversesMetadata {
  if (! Array.isArray(data)) {
    return false;
  }
  for (const datum of data) {
    if (! isUniverseMetadataData(datum)) {
      return false;
    }
  }
  return true;
}

export class UniversesManager {

  _universesMetadataStatusMap: Map<UniverseIdType, UniverseMetadataDataStatus>;
  _universes: Map<UniverseIdType, UniverseModel>;
  _currentUniverseId: UniverseIdType | undefined;

  constructor() {
    this._universesMetadataStatusMap = new Map<UniverseIdType, UniverseMetadataDataStatus>();
    this._universes = new Map<UniverseIdType, UniverseModel>();
  }

  loadUniversesMetadata(data: any) {
    if (! data) {
      throw new Error('Empty universes metadata passed to UniversesManager')
    }
    if (! Array.isArray(data)) {
      throw new Error('Invalid universes metadata passed to UniversesManager')
    }
    const isLoaded = false;
    for (const [index, u] of data.entries()) {
      if (! isUniverseMetadataData(u) ) {
        throw new Error(`Invalid universes metadata passed to UniversesManager in element ${index}.`)
      }
      this._universesMetadataStatusMap.set(u.id, { ...u, isLoaded});
    }
  }

  async initUniverses() {
    const universesMetadataData = await $fetch('/api/universes');
    this.loadUniversesMetadata(universesMetadataData);
    if (this._universesMetadataStatusMap.size > 0) {
      this._currentUniverseId = [...this._universesMetadataStatusMap.values()][0]?.id || undefined;
    }
  }

  async initDefaultUniverse() {
    if (typeof this.currentUniverseId !== "undefined") {
      return this.getUniverse(this.currentUniverseId);
    }
  }

  get currentUniverseId(): string | undefined {
    return this._currentUniverseId;
  }

  async setCurrentUniverseId(universeId: string) {
    if (this._universesMetadataStatusMap.has(universeId)) {
      const universeMetadataDataStatus = this._universesMetadataStatusMap.get(universeId);
      if (! universeMetadataDataStatus!.isLoaded) {
        await this.getUniverse(universeId);
      }
      if (this._universes.has(universeId)) {
        this._currentUniverseId = universeId;
      }
    }
  }

  get universe() {
    if (this._currentUniverseId && this._universes.has(this._currentUniverseId)) {
      return this._universes.get(this._currentUniverseId);
    }
  }

  get universesMetadata() {
    return [...this._universesMetadataStatusMap.values()];
  }

  async getUniverse(universeId: UniverseIdType) {
    const universeMetadata = this._universesMetadataStatusMap.get(universeId);
    if (! universeMetadata) {
      throw new Error(`No universe metadata for universe ID ${universeId}`);
    }
    if (universeMetadata.isLoaded && this._universes.has(universeId)) {
      return this._universes.get(universeId);
    }
    const universeData = await $fetch(`/api/universe/${universeId}`, {});
    if (! universeData) {
      throw new Error(`No universe data for universe ID ${universeId} found.`);
    }
    if (! isUniverseModelData(universeData)) {
      const parsedResponse = universeParse(universeData);
      console.error(`UniversesManager.getUniverse(), invalid universeData for universeId ${universeId} parsedResponse: `, parsedResponse);
      throw createSchemaValidationError(parsedResponse, 'UniversesManager.getUniverse(), invalid universeData. ');
    }
    let universe = new UniverseModel(universeData);
    this._universes.set(universeId, universe);
    universeMetadata.isLoaded = true;
    return universe;
  }

  async getUniverses() {
    const universes = await Promise.all([...this._universesMetadataStatusMap.keys()]
      .map(
        async (universeId) =>
        {
          return await this.getUniverse(universeId)
        }));
    return universes;
  }

  async getNewUniverseId() : Promise<IdType> {
    return $fetch('/api/id-gen');
  }

  static toUniverseMetadataDataStatus(universe: UniverseModel | UniverseMetadataData, isLoaded: boolean) : UniverseMetadataDataStatus {
    return {...this.toUniverseMetadataData(universe), isLoaded};
  }

  static toUniverseMetadataData(universe: UniverseModel | UniverseMetadataData) : UniverseMetadataData {
    return {
      id: universe.id,
      name: universe.name,
    }
  }

  async addUniverse(data: UniverseModelData) {
    if (this._universesMetadataStatusMap.has(data.id)) {
      data.id = await this.getNewUniverseId();
    }
    const universe = new UniverseModel(data);
    this._universes.set(universe.id, universe);
    this._universesMetadataStatusMap.set(universe.id, UniversesManager.toUniverseMetadataDataStatus(universe, true));
    return universe;
  }
}