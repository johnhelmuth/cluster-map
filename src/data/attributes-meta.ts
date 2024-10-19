import type {SystemAttributesInterface, SystemAttributesKeyType} from "@/types/SystemTypes";
import type {attributeFormatType, attributeValueType} from "@/types/BasicTypes";
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

export const attributeRatingDescriptors: { [SystemAttributesKeyType]: Map<attributeValueType, string>} = {
  "technology": new Map([
    [-4, "Stone age"],
    [-3, "Metallurgy"],
    [-2, "Industrialization"],
    [-1, "Atomic power"],
    [0, "Exploring the system"],
    [1, "Exploiting the system"],
    [2, "FTL use"],
    [3, "FTL mastery"],
    [4, "On the verge of collapse"],
  ]),
  "environment":  new Map([
    [-4, "No habitable worlds at all"],
    [-3, "Barren world (gravity, no atmosphere"],
    [-2, "Hostile environment (gravity but dangerous atmosphere"],
    [-1, "Survivable world"],
    [0, "One garden (and perhaps additional barren worlds)"],
    [1, "One garden and several hostile environments"],
    [2, "One garden and several survivable worlds"],
    [3, "Some garden worlds"],
    [4, "Many garden worlds"],
  ]),
  "resources":  new Map([
    [-4, "No resources"],
    [-3, "Multiple dependencies"],
    [-2, "Needs imports"],
    [-1, "Almost viable"],
    [0, "Sustainable"],
    [1, "Rich"],
    [2, "One significant export"],
    [3, "Multiple exports"],
    [4, "All you could want"],
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
  return attributeRatingDescriptors?.[attributeName].get(attributeValue);
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
