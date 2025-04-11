
import {UniverseModel, isUniverseModelData, UniverseModelData} from "~/models/UniverseModel";

import clusterJsonDLC from "~/server/data/universes/cluster-DLC.json";
import clusterJson1652 from "~/server/data/universes/cluster-1652.json";
import clusterJson2Systems from "~/server/data/universes/cluster-3.json";
import universeDLCOnlyData from "~/server/data/universes/universe-DLC-only.json";
import universeDLCPlus25Data from "~/server/data/universes/universe-DLC-25-random.json";
import {UniversesManager} from "~/models/UniversesManager";

const defaultUniverseData = {
  type: 'universe',
  schemaVersion: '1',
  id: 'default',
  name: 'Default universe',
  currentClusterId: clusterJsonDLC.id,
  clusters: [
    clusterJsonDLC,
    clusterJson1652,
    clusterJson2Systems
  ]
};


import {universeParse, createSchemaValidationError} from "~/utils/import-validator";

export const universesData = [defaultUniverseData, universeDLCPlus25Data, universeDLCOnlyData] as Array<UniverseModelData>;

export const universesMetadataData = universesData
  .map(universeData => {
    if (! isUniverseModelData(universeData)) {
      const parsedResponse = universeParse(universeData);
      throw createSchemaValidationError(parsedResponse, 'DataSource, invalid universeData. ');
    }
    return UniversesManager.toUniverseMetadataData(universeData);
  });

console.log('universesMetadataData: ', universesMetadataData);

