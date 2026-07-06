
import {parseAsCharacterData, parseCharacter} from "~/utils/import-validator";
import type {ParseResult} from "@exodus/schemasafe";
import {CharacterData} from "~/types/character/CharacterTypes";

// https://nitro.unjs.io/guide/assets#server-assets
const assets = useStorage('assets:characters');

export default defineEventHandler(async (event) => {

  const characters = [] as CharacterData[];
  const parseErrors = [] as Array<[any, ParseResult]>;

  const characterKeys = await assets.keys();
  const charactersData = await assets.getItems(characterKeys);
  for await (const {key, value: characterDoc} of charactersData) {
    if (key.startsWith("templates:")) {
      continue;
    }
    if (parseAsCharacterData(characterDoc)) {
      characters.push(characterDoc);
    } else {
      const parseResults = parseCharacter(JSON.stringify(characterDoc));
      parseErrors.push([characterDoc, parseResults])
    }
  }
  if (parseErrors.length > 0) {
    console.warn('parseErrors', parseErrors);
  }

  return {characters, parseErrors};
})
