
import sampleCharacterData from "~/data/characters/sample-character.json"
import sampleCharacter2Data from "~/data/characters/sample-character2.json"
import {parseCharacter} from "~/utils/import-validator";

const defaultCharactersRawData =
  [sampleCharacterData, sampleCharacter2Data];

const characters = new Map<string, any>();

defaultCharactersRawData.forEach((character) => {
  const parseResults = parseCharacter(JSON.stringify(character));
  if (parseResults.valid && parseResults.value?.id) {
    characters.set(parseResults.value.id, parseResults.value);
  }
  else {
    console.log('Invalid character. parseResults: ', parseResults);
  }
});

export function useCharactersStore() {
  return {characters}
}
