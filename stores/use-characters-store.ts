
import {parseAsCharacterData, parseCharacter} from "~/utils/import-validator";
import {CharacterModel} from "~/models/character/CharacterModel";
import type {
  TraitLabelsType,
  TraitLabelsTypeKeys,
  TraitTypesKeys
} from "~/types/character/CharacterTypes";

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

  const loaded = ref(false);
  const error = ref(false);

  const parseErrors = ref([] as Array<ParseResult>);
  const {data: characters} = await useAsyncData('characters', async () => {
    const rawCharacters = await $fetch('/api/characters');
    const characters = new Map<string, CharacterModel>();
    if (typeof rawCharacters !== "undefined") {
      rawCharacters.forEach((characterDoc: any) => {
        if (parseAsCharacterData(characterDoc)) {
          const characterModel = new CharacterModel(characterDoc);
          characters.set(characterModel.id, characterModel);
        } else {
          const parseResults = parseCharacter(JSON.stringify(characterDoc));
          // @ts-ignore
          parseErrors.value.push(parseResults)
        }
      })
      if (parseErrors.value.length > 0) {
        error.value = true;
      }
    }
    return characters;
  });

  function getCharacter(characterId: string) : CharacterModel | undefined {
    return typeof characters.value !== 'undefined' && characters.value.has(characterId) ? characters.value.get(characterId) : undefined;
  }

  function getCharactersByTag(tag: string) {
    const charactersList = [];
    if (typeof characters.value !== "undefined") {
      for (const [characterId, character] of characters.value) {
        if (character?.tags && character.tags.includes(tag)) {
          charactersList.push(character);
        }
      }
    }
    return charactersList;
  }

  function getCharacterCampaigns() {
    const campaignSet = new Set<string>([UNASSIGNED_CAMPAIGN]);
    if (typeof characters.value !== "undefined") {
      for (const character of characters.value.values()) {
        character.campaigns.forEach(campaign => campaignSet.add(campaign));
      }
    }
    return campaignSet;
  }

  function getCharacterTags() {
    const tagsSet = new Set<string>();
    if (typeof characters.value !== "undefined") {
      for (const character of characters.value.values()) {
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
    loaded,
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
