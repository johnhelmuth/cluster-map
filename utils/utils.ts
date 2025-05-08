import type {PointType} from "@/types/GeometryTypes.js";
import type {BoundingBoxType, PositionThing, PositionThingList} from "@/types/BasicTypes";
import type { ClusterOrientationType } from "@/types/MapViewTypes";
import {getMapDimensions} from "~/utils/cluster-generator";

export function getBoundingBox(things: PositionThingList) : BoundingBoxType {

  const upperLeft: PointType = { x: Number.MAX_SAFE_INTEGER, y: Number.MAX_SAFE_INTEGER };
  const lowerRight: PointType = { x: Number.MIN_SAFE_INTEGER, y: Number.MIN_SAFE_INTEGER }

  things.forEach((thing: PositionThing) => {
    const { x, y } = thing.position;
    if (upperLeft.x > x) {
      upperLeft.x = x;
    }
    if (upperLeft.y > y) {
      upperLeft.y = y;
    }
    if (lowerRight.x < x) {
      lowerRight.x = x;
    }
    if (lowerRight.y < y) {
      lowerRight.y = y;
    }
  });
  return { upperLeft, lowerRight };
}

export function oppositeOrientation(orientation: ClusterOrientationType) : ClusterOrientationType {
  switch (orientation) {
    case 'landscape':
      return 'portrait';
    case 'portrait':
      return 'landscape';
  }
  return orientation;
}

export function rotatePosition(position : PointType) : PointType {
  const {center, centerPortrait} = getMapDimensions();
  const rotationAngle = Math.PI / 2
  const translateDiff = { x: center.x - centerPortrait.x, y: center.y - centerPortrait.y };
  const transPos = { x: center.x - position.x, y: center.y - position.y };
  const x = transPos.x * Math.cos(rotationAngle) - transPos.y * Math.sin(rotationAngle) + center.x - translateDiff.x;
  const y = transPos.y * Math.cos(rotationAngle) + transPos.x * Math.sin(rotationAngle) + center.y - translateDiff.y;

  return { x, y };
}