
import {parseAsCharacterData, parseCharacter} from "~/utils/import-validator";
import {CharacterModel} from "~/models/character/CharacterModel";
import type {
  CharacterIdType,
  TraitLabelsType,
  TraitLabelsTypeKeys,
  TraitTypesKeys
} from "~/types/character/CharacterTypes";
export { type ParseResult } from "@exodus/schemasafe";

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
const ladderAbbrev = new Map<number, string>([
  [-4, "Horrif"],
  [-3, "Catast"],
  [-2, "Terr"],
  [-1, "Poor"],
  [0, "Medio"],
  [1, "Avg"],
  [2, "Fair"],
  [3, "Good"],
  [4, "Great"],
  [5, "Superb"],
  [6, "Fant"],
  [7, "Epic"],
  [8, "Legend"],
]);

function getTraitLabel(trait: TraitTypesKeys, plurality = "singular" as TraitLabelsTypeKeys): string | undefined {
  if (traitLabels.has(trait)) {
    const traitLabelMetadata = traitLabels.get(trait);
    if (traitLabelMetadata) {
      return traitLabelMetadata[plurality];
    }
  }
}

function getLadderLabel(rating: number, useAbbrev = false): string | undefined {
  if (useAbbrev) {
    if (ladderAbbrev.has(rating)) {
      return ladderAbbrev.get(rating);
    }
  } else {
    if (ladder.has(rating)) {
      return ladder.get(rating);
    }
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

export function useCharactersStore() {

  const characters = reactive(new Map<string, CharacterModel>());
  const loaded = ref(false);
  const error = ref(false);

  function getCharacter(characterId: CharacterIdType) : CharacterModel | undefined {
    return characters.has(characterId) && characters.get(characterId) || undefined;
  }

  const parseErrors = ref([] as Array<ParseResult>);
  queryCollection('characters').all()
      .then(characterDocs => {
        characterDocs.forEach((characterDoc) => {
          console.log('useCharactersStore() characterDoc: ', characterDoc);
          if (parseAsCharacterData(characterDoc.meta.body)) {
            const characterModel = new CharacterModel(characterDoc.meta.body);
            characters.set(characterModel.id, characterModel);
          } else {
            const parseResults = parseCharacter(JSON.stringify(characterDoc.meta.body));
            parseErrors.value.push(parseResults)
          }
        })
        if (parseErrors.value.length > 0) {
          error.value = true;
        }
      })
      .catch(err => {
        error.value = err;
      });

  return {
    loaded,
    error,
    parseErrors,
    characters,
    getCharacter,
    getTraitLabel,
    formatTraitRank,
    getLadderLabel
  }
}
