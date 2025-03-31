import type {IdType} from "~/types/BasicTypes";
import type {AspectData, CharacterIdType} from "~/types/character/CharacterTypes";

export type SceneIdType = IdType;

export interface SceneData {
  schemaVersion: string,
  id: SceneIdType,
  title: string,
  description: string,
  aspects: Array<AspectData>,
  characterIds: Array<CharacterIdType>
}