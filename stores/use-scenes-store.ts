import scene1 from "~/data/scenes/scene1.json";
import {parseAsSceneData, parseScene} from "~/utils/import-validator";
import {SceneModel} from "~/models/scenes/SceneModel";
import type {SceneIdType} from "~/types/scenes/SceneTypes";

const defaultSceneData = [scene1];

const scenes = reactive(new Map<SceneIdType, SceneModel>);

function getScene(sceneId: SceneIdType) {
  return scenes.has(sceneId) && scenes.get(sceneId) || undefined;
}

defaultSceneData.forEach((scene) => {
  const parseResults = parseCharacter(JSON.stringify(scene));
  if (parseAsSceneData(scene)) {
    const sceneModel = new SceneModel(scene);
    scenes.set(sceneModel.id, sceneModel);
  } else {
    console.warn('Invalid scene. parseResults: ', parseResults);
  }
});

export function useScenesStore() {
  return {
    scenes,
    getScene
  }
}
