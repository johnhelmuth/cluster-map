
import type {
    CharacterAspectData,
    CharacterData,
    StuntData, TrackData,
    TraitData,
    TraitTypesKeys
} from "~/types/character/CharacterTypes";
import {DEFAULT_REFRESH} from "~/types/character/CharacterTypes";

export class CharacterModel implements CharacterData {

    schemaVersion: string;
    id: string;
    name: string;
    description: string;
    refresh: number;
    fatePoints: number;
    aspects: Array<CharacterAspectData>;
    traitType: TraitTypesKeys;
    traits: Array<TraitData>;
    stunts: Array<StuntData>;
    tracks: Array<TrackData>;

    constructor(data: CharacterData) {
        this.schemaVersion = data.schemaVersion;
        this.id = data.id;
        this.name = data.name;
        this.description = data?.description ?? "";
        this.refresh = data?.refresh ?? DEFAULT_REFRESH;
        this.fatePoints = data?.fatePoints ?? DEFAULT_REFRESH;
        this.aspects = data?.aspects ?? [];
        this.traitType = data?.traitType ?? 'skill' as TraitTypesKeys;
        this.traits = data?.traits ?? [];
        this.stunts = data?.stunts ?? [];
        this.tracks = data?.tracks ?? [];
    }

    toggleStressBox(trackId : string, stressIndex: number) {
        const track = this.tracks.find((track) => track.trackId === trackId);
        if (track) {
            console.log('CharacterModel.toggleStressBox() track: ', track);
            if (stressIndex < track.stressParams.isUsed.length) {
                track.stressParams.isUsed[stressIndex] = ! track.stressParams.isUsed[stressIndex];
            }
        } else {
            console.log('CharacterModel.toggleStressBox() could not find track: ', trackId);
        }
    }
}