import type {SystemModelInterface} from "@/types/SystemTypes.js";
import type {PointType} from "@/types/GeometryTypes.js";
import type {ClustersModelDataType} from "@/types/ClusterTypes";
import type {BoundingBoxType, ClusterOrientationType, PositionThing, PositionThingList} from "@/types/BasicTypes";
import {getMapDimensions} from "@/utilities/ClusterGenerator";

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
  const {center} = getMapDimensions();
  const rotationAngle = Math.PI / 2
  const transPos = { x: center.x - position.x, y: center.y - position.y };
  const x = transPos.x * Math.cos(rotationAngle) - transPos.y * Math.sin(rotationAngle) + center.x;
  const y = transPos.y * Math.cos(rotationAngle) + transPos.x * Math.sin(rotationAngle) + center.y;
  return { x, y };
}

export function isClustersModelDataType(data : object | ClustersModelDataType) : data is ClustersModelDataType {
  const hasCurrentClusterId = ((data as ClustersModelDataType)?.currentClusterId !== undefined);
  return hasCurrentClusterId
    && typeof (data as ClustersModelDataType).currentClusterId === 'string'
    && (data as ClustersModelDataType).clusters !== undefined
    && ((data as ClustersModelDataType).clusters?.length === 0 || (data as ClustersModelDataType).clusters?.length > 0)
}
