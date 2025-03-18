
import defaultUniverseData from "~/data/universes/universe-default.json";
import universe25Data from "~/data/universes/universe-25-random.json"
import universeDLCOnlyData from "~/data/universes/universe-DLC-only.json"
import {UniverseModelDataType} from "~/types/ClusterTypes";

export const universesData: Array<UniverseModelDataType> = [
    defaultUniverseData as UniverseModelDataType,
    universe25Data as UniverseModelDataType,
    universeDLCOnlyData as UniverseModelDataType,
];

const logLabel = import.meta.client ? 'CLIENT: ' : 'SERVER: ';
// console.log(`${logLabel}server/data/universesData universesData: `, universesData);