import {parser, type ParseResult} from '@exodus/schemasafe';
import straitSchema from '@/data/schemas/strait.schema.json';
import systemSchema from '@/data/schemas/system.schema.json';
import clusterSchema from '@/data/schemas/cluster.schema.json';
import clustersSchema from '@/data/schemas/clusters.schema.json';

const parseOptions = {
  mode: "lax",
  includeErrors: true,
};

export const straitJSONParse = parser(straitSchema, parseOptions);
export function straitParse(data: any) {
  return straitJSONParse(JSON.stringify(data))
}
export const systemJSONParse = parser(systemSchema, parseOptions);
export function systemParse(data: any) {
  return systemJSONParse(JSON.stringify(data))
}
export const clusterJSONParse = parser(clusterSchema, {
  ...parseOptions,
  schemas: {
    "https://in-dire-straits.space/data/schemas/system.schema.json": systemSchema,
    "https://in-dire-straits.space/data/schemas/strait.schema.json": straitSchema,
  }
});
export function clusterParse(data: any) {
  return clusterJSONParse(JSON.stringify(data))
}
export const clustersJSONParse = parser(clustersSchema, {
  ...parseOptions,
  schemas: {
    "https://in-dire-straits.space/data/schemas/system.schema.json": systemSchema,
    "https://in-dire-straits.space/data/schemas/strait.schema.json": straitSchema,
    "https://in-dire-straits.space/data/schemas/cluster.schema.json": clusterSchema,
  }
});
export function clustersParse(data: any) {
  return clustersJSONParse(JSON.stringify(data))
}

export function createSchemaValidationError(parseResponse: ParseResult, msgPrefix: string) {
  let errMsg = msgPrefix;
  if (parseResponse.error) {
    errMsg += parseResponse.error;
  }
  return new Error(errMsg);
}
