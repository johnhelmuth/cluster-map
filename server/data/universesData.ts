
import defaultUniverseData from "~/data/universes/universe-default.json";
import universe25Data from "~/data/universes/universe-25-random.json"
import universeDLCOnlyData from "~/data/universes/universe-DLC-only.json"
import type {UniverseModelDataType} from "~/types/ClusterTypes";

export const universesData: Array<UniverseModelDataType> = [
  defaultUniverseData as UniverseModelDataType,
  universe25Data as UniverseModelDataType,
  universeDLCOnlyData as UniverseModelDataType,
];
