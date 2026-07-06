import {glob, readFile} from "node:fs/promises";
import {parseAsCharacterData, parseCharacter} from "~/utils/import-validator";
import type {ParseResult} from "@exodus/schemasafe";
import {CharacterData} from "~/types/character/CharacterTypes";


export default defineEventHandler(async (event) => {

  const charactersDataDir = './data/characters';
  const globOpts = {
    cwd: charactersDataDir,
    exclude: ['templates/**']
  };
  const characters = [] as CharacterData[];
  const parseErrors = [] as Array<[any, ParseResult]>;
  for await (const path of glob('**/*.json', globOpts)) {
    const characterDocRaw = await readFile(charactersDataDir + '/' + path, 'utf8');
    const characterDoc = JSON.parse(characterDocRaw);
    if (parseAsCharacterData(characterDoc)) {
      characters.push(characterDoc);
    } else {
      const parseResults = parseCharacter(JSON.stringify(characterDoc));
      // @ts-ignore
      parseErrors.value.push([characterDocRaw, parseResults])
    }
  }

  return characters;
})
