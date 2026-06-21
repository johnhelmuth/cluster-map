import {
  ActionTypes,
  type CharacterAspectData,
  type CharacterData, type CharacterTypesKeys, type ModificationTypesKeys,
  type StuntData,
  type TrackData,
  type TraitData,
  type TraitTypesKeys
} from "~/types/character/CharacterTypes";

export class CharacterModel implements CharacterData {

  schemaVersion: string;
  id: string;
  name: string;
  playerName: string;
  characterType?: CharacterTypesKeys;
  campaigns: Array<string>;
  description: string;
  refresh: number;
  fatePoints: number;
  aspects: Array<CharacterAspectData>;
  imageUrl?: string;
  traitType: TraitTypesKeys;
  traits: Array<TraitData>;
  stunts: Array<StuntData>;
  tracks: Array<TrackData>;
  notes: Array<string>;
  tags: Array<string>;

  constructor(data: CharacterData) {
    this.schemaVersion = data.schemaVersion;
    this.id = data.id;
    this.name = data.name;
    this.playerName = data?.playerName ?? "";
    this.campaigns = data?.campaigns ?? [];
    this.characterType = data?.characterType;
    this.description = data?.description ?? "";
    this.refresh = data?.refresh;
    this.fatePoints = data?.fatePoints;
    this.aspects = data?.aspects ?? [];
    this.imageUrl = data?.imageUrl ?? undefined;
    this.traitType = data?.traitType ?? 'skill' as TraitTypesKeys;
    this.traits = data?.traits ?? [];
    this.stunts = data?.stunts ?? [];
    this.tracks = data?.tracks ?? [];
    this.notes = data?.notes ?? [];
    this.tags = data?.tags ?? [];
  }

  getTrack(trackId: string) {
    return this.tracks.find((track) => track.trackId === trackId);
  }

  toggleBox(trackId: string, boxIndex: number) {
    const track = this.getTrack(trackId);
    if (track) {
      if (boxIndex > -1 && boxIndex < track.boxes.length && typeof track.boxes[boxIndex] !== 'undefined') {
        track.boxes[boxIndex].isUsed = !track.boxes[boxIndex].isUsed;
      } else {
        console.warn(`CharacterModel.toggleBox() asked to toggle a box that doesn't exist, boxIndex: `, boxIndex);
      }
    } else {
      console.warn('CharacterModel.toggleBox() could not find track: ', trackId);
    }
  }

  useCharacterAspectInvoke(aspectIndex: number) {
    if (aspectIndex < this.aspects.length && this.aspects[aspectIndex]?.freeInvokes) {
      this.aspects[aspectIndex].freeInvokes--;
    } else {
      console.warn('CharacterModel.useCharacterAspectInvoke() Invalid aspect index or aspect selected does not have enough free invokes.');
    }
  }

  useTrackInvoke(trackId: string) {
    const track = this.getTrack(trackId);
    if (track) {
      if (typeof track?.aspect?.freeInvokes === "number" && track.aspect.freeInvokes) {
        track.aspect.freeInvokes--;
      } else {
        console.warn(`CharacterModel.useTrackInvoke() asked to use a free invoke that doesn't exist, track?.aspect?.freeInvokes: `, track?.aspect?.freeInvokes);
      }
    } else {
      console.warn('CharacterModel.useTrackInvoke() could not find track: ', trackId);
    }
  }

  stuntDiceExpression(stuntIndex: number) {
    if (stuntIndex > -1 && stuntIndex < this.stunts.length) {
      const stunt = this.stunts[stuntIndex];
      if (stunt) {
        let trait: string | undefined;
        let traitRank: number | undefined;
        let modifier: number | undefined;
        let actionString: string | undefined;
        let modificationType: ModificationTypesKeys | undefined;
        if (stunt.parameters) {
          if (typeof stunt.parameters?.actions !== 'undefined'
            && stunt.parameters.actions.length > 0
          ) {
            const actions = stunt.parameters.actions;
            const listFormatter = new Intl.ListFormat("en", {
              style: "long",
              type: "disjunction",
            })
            actionString = listFormatter.format(actions.map(a => ActionTypes[a]));
          }
          if (actionString) {
            const descriptionList = [actionString];
            const exprList: string[] = [];
            const effectList: string[] = [];
            if (stunt.parameters.trait) {
              trait = stunt.parameters.trait;
              // Put the trait in front of the action type, e.g. `Stealth Overcome` or `Stealth Overcome or Create an Advantage`
              descriptionList.unshift(trait);
            }
            descriptionList.push('roll');
            traitRank = this.getTraitRank(trait);
            if (typeof stunt.parameters?.modifier !== 'undefined') {
              modifier = stunt.parameters.modifier;
            }
            if (trait && typeof modifier === 'number' && modifier) {
              modificationType = (stunt.parameters?.modificationType || 'roll') as ModificationTypesKeys;
              if (modificationType) {
                if (modificationType === 'roll') {
                  exprList.push('4dF');
                  if (traitRank !== 0) {
                    exprList.push((traitRank < 0 ? '-' : '+') + Math.abs(traitRank+modifier));
                  }
                } else {
                  effectList.push(`plus ${modifier} shifts if successful`)
                }
              }
            }
            return {
              description: [
                descriptionList.join(' '),
                exprList.join(''),
                effectList.join(' ')
              ].join(' '),
              expression: exprList.join('')
            }
          }
        }
      }
    }
  }

  getTraitRank(traitName?: string) {
    const trait = this.traits.find((trait) => trait.name === traitName);
    if (trait) {
      return trait.rank || 0;
    }
    return 0;
  }

  toLink() {
    if (this?.id) {
      return `/characters/${this.id}`;
    }
  }

  renderTagsList() {
    if (this.tags && this.tags.length) {
      return this.tags.join(', ');
    }
  }

}