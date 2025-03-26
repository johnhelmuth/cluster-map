import type {
  CharacterAspectData,
  CharacterData,
  StuntData,
  TrackData,
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

  getTrack(trackId: string) {
    return this.tracks.find((track) => track.trackId === trackId);
  }
  toggleBox(trackId: string, boxIndex: number) {
    const track = this.getTrack(trackId);
    if (track) {
      if (boxIndex < track.boxes.length) {
        track.boxes[boxIndex].isUsed = !track.boxes[boxIndex].isUsed;
      } else {
        console.warn(`CharacterModel.toggleBox() asked to toggle a box that doesn't exist, boxIndex: `, boxIndex);
      }
    } else {
      console.warn('CharacterModel.toggleBox() could not find track: ', trackId);
    }
  }

  useInvoke(trackId: string) {
    const track = this.getTrack(trackId);
    if (track) {
      if (typeof track?.aspect?.freeInvokes === "number" && track.aspect.freeInvokes) {
        track.aspect.freeInvokes--;
      } else {
        console.warn(`CharacterModel.useInvoke() asked to use a free invoke that doesn't exist, track?.aspect?.freeInvokes: `, track?.aspect?.freeInvokes);
      }
    } else {
      console.warn('CharacterModel.useInvoke() could not find track: ', trackId);
    }
  }

  toLink() {
    if (this?.id) {
      return `/character/${this.id}`;
    }
  }

}