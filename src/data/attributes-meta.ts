import type {SystemAttributesInterface, SystemAttributesKeyType} from "@/types/SystemTypes";
import type {attributeFormatType, attributeValueType, attributeRatingMetaType} from "@/types/BasicTypes";
import {SystemAttributesDefaults} from "@/types/SystemTypes";

export const attributesMeta: { [SystemAttributesKeyType]: { name: string, abbrev: string } } = {
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

export const attributeRatingDescriptors: { [SystemAttributesKeyType]: Map<attributeValueType, attributeRatingMetaType>} = {
  "technology": new Map([
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
  "environment":  new Map([
    [-4, { "name": "No habitable worlds at all", color: "#7f6000ff" }],
    [-3, { "name": "Barren world (gravity, no atmosphere", color: "#bf9000ff" }],
    [-2, { "name": "Hostile environment (gravity but dangerous atmosphere", color: "#f1c232ff" }],
    [-1, { "name": "Survivable world", color: "#ffd966ff" }],
    [0, { "name": "One garden (and perhaps additional barren worlds)", color: "#d9ead3ff" }],
    [1, { "name": "One garden and several hostile environments", color: "#b0e497ff" }],
    [2, { "name": "One garden and several survivable worlds", color: "#8ad073ff" }],
    [3, { "name": "Some garden worlds", color: "#6bb649ff" }],
    [4, { "name": "Many garden worlds", color: "#38761dff" }],
  ]),
  "resources":  new Map([
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
  attributeName: string,
  attributeValue: SystemAttributesKeyType,
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
  attributeName: string,
  attributeValue: SystemAttributesKeyType,
  field: "name" | "abbrev",
  delimiter: "" | ":"
): string {
  return `${attributesMeta[attributeName][field]}${delimiter}${attributeValue}`;
}

function formatAttributeDetailed(attributeName: string, attributeValue: SystemAttributesKeyType): string {
  const description = getAttributeDescription(attributeName, attributeValue);
  const formattedAttribute = formatAttribute(attributeName, attributeValue, "short");
  return formattedAttribute
    + (description
    ? ` ${description}`
    : '');
}

export function getAttributeDescription(attributeName: string, attributeValue: SystemAttributesKeyType): string {
  return attributeRatingDescriptors?.[attributeName].get(attributeValue)?.name;
}

export function getEnvironmentColor(attributeValue: SystemAttributesKeyType): string {
  return attributeRatingDescriptors?.environment.get(attributeValue)?.color;
}

export function attributesFormatted(attributes : SystemAttributesInterface, format:attributeFormatType ): string {
  const formattedAttributes = Object.keys(SystemAttributesDefaults)
    .map((attributeName) => {
      const fa = formatAttribute(attributeName, attributes[attributeName], format)
      return fa;
    })
    .join(' ');
  return formattedAttributes;
}
