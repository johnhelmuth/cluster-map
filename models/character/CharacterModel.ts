import {
  ActionTypes,
  type CharacterAspectData,
  type CharacterData,
  type CharacterTypesKeys,
  type ImageData,
  type ModificationTypesKeys,
  type StuntData,
  type StuntMechanicAddConsequenceData,
  type StuntMechanicDieRollData,
  type TrackData,
  type TraitData,
  type TraitTypesKeys
} from "~/types/character/CharacterTypes";

export interface StuntMechanicDescription {
  description: string;
  expression?: string;
}

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
  images?: ImageData[];
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
    this.images = data?.images?.length ? data.images : undefined;
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

  stuntMechanicsDescription(stuntIndex: number) {
    if (stuntIndex > -1 && stuntIndex < this.stunts.length) {
      const actionDescriptions = [] as StuntMechanicDescription[];
      const stunt = this.stunts[stuntIndex];
      if (stunt && stunt.mechanics && stunt.mechanics.length) {
        for (const mechanic of stunt.mechanics) {
          let description: StuntMechanicDescription | undefined;
          switch (mechanic.mechanicType) {
            case "dice-roll":
              description = this.stuntMechanicDiceRollDescription(mechanic);
              break;
            case "add-consequence":
              description = this.stuntMechanicAddConsequenceDescription(mechanic);
              break;
          }
          if (description) {
            actionDescriptions.push(description);
          }
        }
      }
      return actionDescriptions;
    }
  }

  stuntMechanicDiceRollDescription(mechanic: StuntMechanicDieRollData) {
    let trait: string | undefined;
    let traitRank: number | undefined;
    let modifier: number | undefined;
    let actionString: string | undefined;
    let modificationType: ModificationTypesKeys | undefined;
    if (typeof mechanic.parameters?.actions !== 'undefined'
      && mechanic.parameters.actions.length > 0
    ) {
      const actions = mechanic.parameters.actions;
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
      if (mechanic.parameters.trait) {
        trait = mechanic.parameters.trait;
        // Put the trait in front of the action type, e.g. `Stealth Overcome` or `Stealth Overcome or Create an Advantage`
        descriptionList.unshift(trait);
      }
      descriptionList.push('roll');
      traitRank = this.getTraitRank(trait);
      if (typeof mechanic.parameters?.modifier !== 'undefined') {
        modifier = mechanic.parameters.modifier;
      }
      if (trait && typeof modifier === 'number' && modifier) {
        modificationType = (mechanic.parameters?.modificationType || 'roll') as ModificationTypesKeys;
        if (modificationType) {
          if (modificationType === 'roll') {
            exprList.push('4dF');
            if (traitRank !== 0) {
              exprList.push((traitRank < 0 ? '-' : '+') + Math.abs(traitRank + modifier));
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
      } as StuntMechanicDescription;
    }
  }

  stuntMechanicAddConsequenceDescription(mechanic: StuntMechanicAddConsequenceData) {
    let description = `Adds a ${mechanic.parameters.consequenceLevel} consequence.`;
    return {description} as StuntMechanicDescription
  }

  getTraitRank(traitName?: string) {
    const trait = this.traits.find((trait) => trait.name === traitName);
    if (trait) {
      return trait.rank || 0;
    }
    return 0;
  }

  highConcept(property = 'name') {
    const hcAspect = this.aspects.find(a => a.aspectType === 'High Concept');
    if (typeof hcAspect !== 'undefined') {
      if (hcAspect.hasOwnProperty(property)) {
        return hcAspect[property as keyof CharacterAspectData];
      }
      return hcAspect.name;
    }
    /* If the character doesn't have a high concept aspect, use the first aspect, if they have any. */
    if (this.aspects.length > 0) {
      const firstAspect = this.aspects[0];
      if (typeof firstAspect !== 'undefined') {
        if (firstAspect.hasOwnProperty(property)) {
          return firstAspect[property as keyof CharacterAspectData];
        }
        return firstAspect.name;
      }
    }
  }

  peakTraits(numTraits = 3) {
    if (this.traits.length > 0) {
      return this.traits
        .sort((a, b) => this.getTraitRank(b.name) - this.getTraitRank(a.name))
        .slice(0, numTraits);
    }
    return [] as TraitData[];
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

  toJSON(key: string): object {
    return {
      ...this,
      "type": "character",
    };
  }

}