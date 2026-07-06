
import {parseAsCharacterData, parseCharacter} from "~/utils/import-validator";
import {CharacterModel} from "~/models/character/CharacterModel";
import type {
  TraitLabelsType,
  TraitLabelsTypeKeys,
  TraitTypesKeys
} from "~/types/character/CharacterTypes";
import { type CharacterData } from "~/types/character/CharacterTypes";

import type { ParseResult } from "@exodus/schemasafe";

const UNASSIGNED_CAMPAIGN = 'unassigned-campaign';

const traitLabels = new Map<TraitTypesKeys, TraitLabelsType>([
  ["skill", {singular: "Skill", plural: "Skills"}],
  ["approach", {singular: "Approach", plural: "Approaches"}],
  ["profession", {singular: "Profession", plural: "Professions"}],
  ["other", {singular: "Trait", plural: "Traits"}],
]);

const ladder = new Map<number, string>([
  [-4, "Horrifying"],
  [-3, "Catastrophic"],
  [-2, "Terrible"],
  [-1, "Poor"],
  [0, "Mediocre"],
  [1, "Average"],
  [2, "Fair"],
  [3, "Good"],
  [4, "Great"],
  [5, "Superb"],
  [6, "Fantastic"],
  [7, "Epic"],
  [8, "Legendary"],
]);

function getTraitLabel(trait: TraitTypesKeys, plurality = "singular" as TraitLabelsTypeKeys): string | undefined {
  if (traitLabels.has(trait)) {
    const traitLabelMetadata = traitLabels.get(trait);
    if (traitLabelMetadata) {
      return traitLabelMetadata[plurality];
    }
  }
}

function getLadderLabel(rating: number): string | undefined {
  if (ladder.has(rating)) {
    return ladder.get(rating);
  }
}

function formatTraitRank(rank: number, padZero = false): string {
  let formattedRank = rank.toString();
  if (rank < 0) {
    formattedRank = `-${-rank}`;
  } else if (rank == 0) {
    formattedRank = (padZero ? " " : "") + "0";
  } else {
    // rank > 0
    formattedRank = `+${rank}`;

  }
  return formattedRank;
}

export async function useCharactersStore() {

  const error = ref(false);

  const parseErrors = ref([] as Array<[any, ParseResult]>);

  const {data: charactersArray} = await useAsyncData('characters', async () => {

    const { characters: rawCharacters } = await $fetch('/api/characters');
    const characters = [] as CharacterData[];
    if (typeof rawCharacters !== "undefined") {
      for (const characterDoc of rawCharacters) {
        if (parseAsCharacterData(characterDoc)) {
          const characterModel = new CharacterModel(characterDoc);
          characters.push(characterDoc);
        } else {
          const parseResults = parseCharacter(JSON.stringify(characterDoc));
          // @ts-ignore
          parseErrors.value.push([characterDoc, parseResults])
        }
      }
      if (parseErrors.value.length > 0) {
        error.value = true;
      }
    }
    return characters;

  });

  const characters = reactive(new Map<string, CharacterModel>());

  if (typeof charactersArray.value !== "undefined") {
    for (const character of charactersArray.value) {
      characters.set(character.id, new CharacterModel(character));
    }
  }

  function getCharacter(characterId: string) : CharacterModel | undefined {
    return typeof characters !== 'undefined' && characters.has(characterId) ? characters.get(characterId) : undefined;
  }

  function getCharactersByTag(tag: string) {
    const charactersList = [];
    if (typeof characters !== "undefined") {
      for (const [characterId, character] of characters) {
        if (character?.tags && character.tags.includes(tag)) {
          charactersList.push(character);
        }
      }
    }
    return charactersList;
  }

  function getCharacterCampaigns() {
    const campaignSet = new Set<string>([UNASSIGNED_CAMPAIGN]);
    if (typeof characters !== "undefined") {
      for (const character of characters.values()) {
        character.campaigns.forEach(campaign => campaignSet.add(campaign));
      }
    }
    return campaignSet;
  }

  function getCharacterTags() {
    const tagsSet = new Set<string>();
    if (typeof characters !== "undefined") {
      for (const character of characters.values()) {
        character.tags.forEach(tag => tagsSet.add(tag));
      }
    }
    return tagsSet;
  }

  function getCampaignTitle(campaign: string) {

    return campaign
      .replace(/-/g, ' ')
      .split(' ')
      .map((t) => t.charAt(0).toUpperCase() + t.slice(1))
      .join(' ');
  }

  return {
    error,
    parseErrors,
    characters,
    getCharacter,
    getCharactersByTag,
    getCharacterTags,
    getCharacterCampaigns,
    getCampaignTitle,
    getTraitLabel,
    formatTraitRank,
    getLadderLabel,
    UNASSIGNED_CAMPAIGN
  }
}
