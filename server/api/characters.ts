import {glob, readFile} from "node:fs/promises";
import {parseAsCharacterData, parseCharacter} from "~/utils/import-validator";
import {CharacterModel} from "~/models/character/CharacterModel";
import type {ParseResult} from "@exodus/schemasafe";


export default defineEventHandler(async (event) => {

  const charactersDataDir = './data/characters';
  const globOpts = {
    cwd: charactersDataDir,
    exclude: ['templates/**']
  };
  const characters = [] as CharacterModel[];
  const parseErrors = [] as Array<[any, ParseResult]>;
  for await (const path of glob('**/*.json', globOpts)) {
    console.log('path: ', path);
    const fullPath = charactersDataDir + '/' + path;
    console.log('fullPath: ', fullPath);
    const characterDocRaw = await readFile(charactersDataDir + '/' + path, 'utf8');
    const characterDoc = JSON.parse(characterDocRaw);
    if (parseAsCharacterData(characterDoc)) {
      const characterModel = new CharacterModel(characterDoc);
      characters.push(characterModel);
    } else {
      const parseResults = parseCharacter(JSON.stringify(characterDoc));
      // @ts-ignore
      parseErrors.value.push([characterDocRaw, parseResults])
    }
  }

  console.log('characters: ', characters);
  console.log('parseErrors: ', parseErrors);

  return characters;
})
