import type {SceneData, SceneIdType} from "~/types/scenes/SceneTypes";
import type {AspectData, CharacterIdType} from "~/types/character/CharacterTypes";
import {parseAsSceneData} from "~/utils/import-validator";
import type {CharacterModel} from "~/models/character/CharacterModel";

import {useCharactersStore} from "~/stores/use-characters-store";

const { getCharacter } = useCharactersStore();

export class SceneModel implements SceneData {
  schemaVersion = "1"
  id: SceneIdType
  title = "Unnamed Scene"
  description = ""
  aspects = [] as Array<AspectData>
  characterIds = [] as Array<CharacterIdType>

  _charactersCache: Map<CharacterIdType, CharacterModel> = new Map();

  constructor(data : any) {
    if (parseAsSceneData(data)) {
      this.id = data.id;
      this.title = data.title;
      this.description = data.description;
      this.aspects = data.aspects;
      this.characterIds = data.characterIds;
    } else {
      throw new Error("Invalid data passed to SceneModel constructor()");
    }
  }

  get numCharacters() { return this.characterIds.length; }

  get characters() {
    return this.characterIds.map(characterId => {
      return this.getCharacter(characterId);
    })
  }

  getCharacter(characterId: CharacterIdType) {
    if (this._charactersCache.has(characterId)) {
      return this._charactersCache.get(characterId);
    }
    const character = getCharacter(characterId);
    if (character) {
      this._charactersCache.set(characterId, character);
    }
    return character;
  }

  toLink() {
    if (this?.id) {
      return `/scene/${this.id}`;
    }
  }
}
