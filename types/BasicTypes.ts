import {z} from 'zod';
import type {PointType} from "@/types/GeometryTypes";


export const attributeValues = [ -4, -3, -2, -1, 0, 1, 2, 3, 4];
export const AttributeValueZSchema = z.number().gte(-4).lte(4);
export type attributeValueType = z.infer<typeof AttributeValueZSchema>;

export const AspectZSchema = z.string();
export type AspectType = z.infer<typeof AspectZSchema>;

export const IdZSchema = z.string();
export type IdType = z.infer<typeof IdZSchema>;

export type attributeFormatType = "short" | "long" | "detailed";

export type MapViewStylesType = 'data' | 'circular' | 'linear';
export const mapViewStyleLabels = [
  {key: 'data' as MapViewStylesType, label: 'Layout from data'},
  {key: 'circular' as MapViewStylesType, label: 'Circular Layout'},
  {key: 'linear' as MapViewStylesType, label: 'Linear Layout'},
];
export const MAP_VIEW_STYLES_DEFAULT = 'data' as MapViewStylesType;

export type ClusterOrientationType = 'portrait' | 'square' | 'landscape';

export type BoundingBoxType = {
  upperLeft: PointType;
  lowerRight: PointType;
};

export type PositionThing = {
  position: PointType;
};

export type PositionThingList = Array<PositionThing>;
