
import defaultUniverseData from "~/data/universes/universe-default.json";
import universe25Data from "~/data/universes/universe-25-random.json"
import universeDLCOnlyData from "~/data/universes/universe-DLC-only.json"
import {UniversesMetaDataModel} from "~/models/UniversesMetaDataModel";


export const universesData = [
    defaultUniverseData,
    universe25Data,
    universeDLCOnlyData,
];

const logLabel = import.meta.client ? 'CLIENT: ' : 'SERVER: ';
console.log(`${logLabel}server/data/universesData universesData: `, universesData);