
export type attributeValueType = -4 | -3 | -2 | -1 | 0 | 1 | 2 | 3 | 4;

export type AspectType = string;

export type IdType = string;

export const attributeValues = [ -4, -3, -2, -1, 0, 1, 2, 3, 4];

export type attributeFormatType = "short" | "long" | "detailed";

export type attributeRatingMetaType = {
  name: string,
  color?: string
};

export type MapViewStylesType = 'data' | 'circular' | 'linear';
export const mapViewStyleLabels = [
  {key: 'data' as MapViewStylesType, label: 'Layout from data'},
  {key: 'circular' as MapViewStylesType, label: 'Circular Layout'},
  {key: 'linear' as MapViewStylesType, label: 'Linear Layout'},
];
const ValidMapViewStyles = mapViewStyleLabels.map(o => o.key);

export const MAP_VIEW_STYLES_DEFAULT = 'circular' as MapViewStylesType;

export function isValidMapStyle(aMapStyle: any): aMapStyle is MapViewStylesType {
  return typeof aMapStyle === 'string' && ValidMapViewStyles.includes(aMapStyle as MapViewStylesType);
}

export type ClusterOrientationType = 'portrait' | 'square' | 'landscape';