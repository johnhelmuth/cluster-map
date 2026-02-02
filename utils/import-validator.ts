

import {type Parse, parser} from '@exodus/schemasafe';
import straitSchema from '@/data/schemas/strait.schema.json';
import systemSchema from '@/data/schemas/system.schema.json';
import clusterSchema from '@/data/schemas/cluster.schema.json';
import clustersSchema from '@/data/schemas/clusters.schema.json';
import diceRollSchema from '@/data/schemas/dice-roll.schema.json';
import diceLogSchema from '@/data/schemas/dice-log.schema.json';


export function getParseClusters() : Parse {
  const parse = parser(clustersSchema, {
    schemas: {
      "https://in-dire-straits.space/data/schemas/system.schema.json": systemSchema,
      "https://in-dire-straits.space/data/schemas/strait.schema.json": straitSchema,
      "https://in-dire-straits.space/data/schemas/cluster.schema.json": clusterSchema,
    },
    mode: "lax",
    includeErrors: true,
  });
  return parse;
}

export function getParseDiceLog() : Parse {
  const parse = parser(diceLogSchema, {
    schemas: {
      "https://in-dire-straits.space/data/schemas/dice-roll.schema.json": diceRollSchema,
    },
    mode: "lax",
    includeErrors: true,
  })
  return parse;
}