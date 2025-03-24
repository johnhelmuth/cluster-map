import sampleCharacterData from "~/data/characters/sample-character.json"
import sampleCharacter2Data from "~/data/characters/sample-character2.json"
import {parseAsCharacterData, parseCharacter} from "~/utils/import-validator";
import {CharacterModel} from "~/models/character/CharacterModel";
import type {
  TraitLabelsType,
  TraitLabelsTypeKeys,
  TraitTypesKeys
} from "~/types/character/CharacterTypes";

const defaultCharactersRawData =
  [sampleCharacterData, sampleCharacter2Data];

const characters = reactive(new Map<string, CharacterModel>());

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

function formatTraitRank(rank: number): string {
  let formattedRank = rank.toString();
  if (rank < 0) {
    formattedRank = `-${rank}`;
  } else if (rank == 0) {
    formattedRank = " 0";
  } else {
    // rank > 0
    formattedRank = `+${rank}`;

  }
  return formattedRank;
}

function getCharacter(characterId: string) : CharacterModel | undefined {
  return characters.has(characterId) && characters.get(characterId) || undefined;
}

defaultCharactersRawData.forEach((character) => {
  const parseResults = parseCharacter(JSON.stringify(character));
  if (parseAsCharacterData(character)) {
    const characterModel = new CharacterModel(character);
    characters.set(characterModel.id, characterModel);
  } else {
    console.log('Invalid character. parseResults: ', parseResults);
  }
});

export function useCharactersStore() {
  return {
    characters,
    getCharacter,
    getTraitLabel,
    formatTraitRank,
    getLadderLabel
  }
}
