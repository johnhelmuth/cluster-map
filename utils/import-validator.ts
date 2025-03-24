

import {type Parse, parser} from '@exodus/schemasafe';
import straitSchema from '~/data/schemas/clusters/strait.schema.json';
import systemSchema from '~/data/schemas/clusters/system.schema.json';
import clusterSchema from '~/data/schemas/clusters/cluster.schema.json';
import clustersSchema from '~/data/schemas/clusters/clusters.schema.json';
import characterSchema from '~/data/schemas/characters/character.schema.json';
import type { CharacterData } from '~/types/character/CharacterTypes';

export function getParseClusters() : Parse {
  const parse = parser(clustersSchema, {
    schemas: {
      "https://in-dire-straits.space/data/schemas/clusters/system.schema.json": systemSchema,
      "https://in-dire-straits.space/data/schemas/clusters/strait.schema.json": straitSchema,
      "https://in-dire-straits.space/data/schemas/clusters/cluster.schema.json": clusterSchema,
    },
    mode: "lax",
    includeErrors: true,
  });
  return parse;
}

export const parseCharacter = parser(characterSchema, {
  mode: "lax",
  includeErrors: true,
});

export function parseAsCharacterData(data: any): data is CharacterData {
  const parseResults = parseCharacter(JSON.stringify(data));
  if (! parseResults?.valid) {
    console.warn('Invalid character. parseResults: ', parseResults);
  }
  return !! parseResults?.valid;
}