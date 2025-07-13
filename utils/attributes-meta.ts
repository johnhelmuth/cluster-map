import type {SystemAttributesInterface, SystemAttributesKeyType, SystemIdType} from "@/types/SystemTypes";
import type {attributeFormatType, attributeValueType, attributeRatingMetaType} from "@/types/BasicTypes";
import {SystemAttributesDefaults} from "@/types/SystemTypes";

export const attributesMeta = {
  "technology": {
    "name": "Technology",
    "abbrev": "T",
  },
  "environment": {
    "name": "Environment",
    "abbrev": "E"
  },
  "resources": {
    "name": "Resources",
    "abbrev": "R"
  }
};

// @TODO Move these into a JSON file or other persistence layer, so that they can be easily edited.
export type AttributeRatingDescriptorType = {
  name: string;
  note?: string;
  color?: string;
}

export const attributeRatingDescriptors = {
  "technology": new Map<number, AttributeRatingDescriptorType>([
    [-4, { "name": "Stone age" }],
    [-3, { "name": "Metallurgy" }],
    [-2, { "name": "Industrialization" }],
    [-1, { "name": "Atomic power" }],
    [0, { "name": "Exploring the system" }],
    [1, { "name": "Exploiting the system" }],
    [2, { "name": "FTL use" }],
    [3, { "name": "FTL mastery" }],
    [4, { "name": "On the verge of collapse" }],
  ]),
  "environment":  new Map<number, AttributeRatingDescriptorType>([
    [-4, { "name": "No habitable worlds at all", color: "#7f6000ff" }],
    [-3, { "name": "Barren world", note: "gravity, no atmosphere", color: "#bf9000ff" }],
    [-2, { "name": "Hostile environment", note: "gravity, dangerous atmosphere", color: "#f1c232ff" }],
    [-1, { "name": "Survivable world", color: "#ffd966ff" }],
    [0, { "name": "One garden", note: "and perhaps additional barren worlds", color: "#d9ead3ff" }],
    [1, { "name": "One garden", note: "and several hostile environments", color: "#b0e497ff" }],
    [2, { "name": "One garden", note: "and several survivable worlds", color: "#8ad073ff" }],
    [3, { "name": "Some garden worlds", color: "#6bb649ff" }],
    [4, { "name": "Many garden worlds", color: "#38761dff" }],
  ]),
  "resources":  new Map<number, AttributeRatingDescriptorType>([
    [-4, { "name": "No resources" }],
    [-3, { "name": "Multiple dependencies" }],
    [-2, { "name": "Needs imports" }],
    [-1, { "name": "Almost viable" }],
    [0, { "name": "Sustainable" }],
    [1, { "name": "Rich" }],
    [2, { "name": "One significant export" }],
    [3, { "name": "Multiple exports" }],
    [4, { "name": "All you could want" }],
  ])
}

// TODO: Refactor these to go into an SystemAttributesModel class
export function formatAttribute(
  attributeName: SystemAttributesKeyType,
  attributeValue: attributeValueType,
  format: attributeFormatType
) : string {
  switch (format) {
    case "short":
      return formatAttributeLocal(attributeName, attributeValue, "abbrev", "");
    case "long":
      return formatAttributeLocal(attributeName, attributeValue, "name", ": ");
    case "detailed":
      return formatAttributeDetailed(attributeName, attributeValue);
  }
  return '';
}

function formatAttributeLocal(
  attributeName: SystemAttributesKeyType,
  attributeValue: attributeValueType,
  field: "name" | "abbrev",
  delimiter: "" | ": "
): string {
  if ( ["technology","environment","resources"].includes(attributeName)) {
    const attributeMeta = attributesMeta[attributeName];
    return `${attributeMeta[field]}${delimiter}${attributeValue}`;
  }
  throw new Error(`formatAttributeLocal() called with an invalid attribute name, ${attributeName}`);
}

function formatAttributeDetailed(attributeName: SystemAttributesKeyType, attributeValue: attributeValueType ): string {
  const description = getAttributeDescription(attributeName, attributeValue);
  const formattedAttribute = formatAttribute(attributeName, attributeValue, "short");
  return formattedAttribute
    + (description
    ? ` ${description}`
    : '');
}

export function getAttributeDescription(attributeName: SystemAttributesKeyType, attributeValue: attributeValueType): string {
  return attributeRatingDescriptors?.[attributeName].get(attributeValue)?.name || '';
}

export function getEnvironmentColor(attributeValue: attributeValueType): string {
  return attributeRatingDescriptors?.environment.get(attributeValue)?.color || '';
}

export function attributesFormatted(attributes : SystemAttributesInterface | undefined, format:attributeFormatType ): string {
  const formattedAttributes = Object.keys(SystemAttributesDefaults)
    .map((attributeName) => {
      const fa = formatAttribute(attributeName as SystemAttributesKeyType, (attributes?.[attributeName as SystemAttributesKeyType] || 0), format)
      return fa;
    })
    .join(' ');
  return formattedAttributes;
}
