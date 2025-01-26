

import {type Parse, parser} from '@exodus/schemasafe';
import straitSchema from '@/data/schemas/strait.schema.json';
import systemSchema from '@/data/schemas/system.schema.json';
import clusterSchema from '@/data/schemas/cluster.schema.json';
import universeSchema from '~/data/schemas/universe.schema.json';


export function getParseUniverse() : Parse {
  const parse = parser(universeSchema, {
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
