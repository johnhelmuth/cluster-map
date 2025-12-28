import type {PointType} from "@/types/GeometryTypes";

export type attributeValueType = -4 | -3 | -2 | -1 | 0 | 1 | 2 | 3 | 4;

export type AspectType = string;

export type IdType = string;

export const attributeValues = [ -4, -3, -2, -1, 0, 1, 2, 3, 4];

export type attributeFormatType = "short" | "long" | "detailed";

export type attributeRatingMetaType = {
  name: string,
  color?: string
};

export type BoundingBoxType = {
  upperLeft: PointType;
  lowerRight: PointType;
};

export type PositionThing = {
  position: PointType;
};

export type PositionThingList = Array<PositionThing>;
