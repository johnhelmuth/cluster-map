


import type {Parse, Validate, ParseResult} from '@exodus/schemasafe';
import {parser, validator} from '@exodus/schemasafe';
import straitSchema from '@/data/schemas/strait.schema.json';
import systemSchema from '@/data/schemas/system.schema.json';
import clusterSchema from '@/data/schemas/cluster.schema.json';
import universeSchema from '~/data/schemas/universe.schema.json';
import type {UniverseModelDataType} from "~/types/ClusterTypes";

const schemas = {
    "https://in-dire-straits.space/data/schemas/system.schema.json": systemSchema,
    "https://in-dire-straits.space/data/schemas/strait.schema.json": straitSchema,
    "https://in-dire-straits.space/data/schemas/cluster.schema.json": clusterSchema,
  };

const parse = parser(universeSchema, {
  schemas,
  mode: "lax",
  includeErrors: true,
});

export function getParseUniverse() : Parse {
  return parse;
}

export function parseUniverseData(data: {}) : ParseResult {
  return parse(JSON.stringify(data));
}

const validate = validator(universeSchema, {
  schemas,
  mode: "lax",
  includeErrors: true,
});

export function validateUniverseData(data: {}): data is UniverseModelDataType {
  return parseUniverseData(data)?.valid || false;
}

