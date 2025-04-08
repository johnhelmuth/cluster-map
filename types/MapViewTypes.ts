

export type MapViewStylesType = 'data' | 'circular' | 'linear';

export const mapViewStyleLabels = [
  {key: 'data' as MapViewStylesType, label: 'Layout from data'},
  {key: 'circular' as MapViewStylesType, label: 'Circular Layout'},
  {key: 'linear' as MapViewStylesType, label: 'Linear Layout'},
];
const ValidMapViewStyles = mapViewStyleLabels.map(o => o.key);

export const MAP_VIEW_STYLES_DEFAULT = 'data' as MapViewStylesType;

export function isValidMapStyle(aMapStyle: any): aMapStyle is MapViewStylesType {
  return typeof aMapStyle === 'string' && ValidMapViewStyles.includes(aMapStyle as MapViewStylesType);
}

export type ClusterOrientationType = 'portrait' | 'square' | 'landscape';
