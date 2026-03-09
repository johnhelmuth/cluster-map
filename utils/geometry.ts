import {getMapDimensions} from "~/utils/cluster-generator";
import type {DrawDirectionType} from "~/types/StraitTypes";

import { intersectBezierLine, type LineType, type BezierCubicLineType } from "~/utils/geometry-lib/bezier-line-intersect";

export type PointType = {
  x: number;
  y: number;
  z?: number;
}

export type BoundingBoxType = {
  upperLeft: PointType;
  lowerRight: PointType;
};

export type PositionThing = {
  position: PointType;
};

export type LineDetailsType = {
  a: PointType,
  b: PointType,
  length: number,
  angle: number,
  normalAngle: number,
  midPoint: PointType
}

export type PositionThingList = Array<PositionThing>;

export type ViewBoxType = {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function rotateAroundPosition(a: PointType, center: PointType, angle: number) {
  const transPos = { x: a.x - center.x, y: a.y - center.y };
  const x = transPos.x * Math.cos(angle) - transPos.y * Math.sin(angle) + center.x;
  const y = transPos.y * Math.cos(angle) + transPos.x * Math.sin(angle) + center.y;
  return { x, y };
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

export function curveAdjustFromDirection(direction: DrawDirectionType): number {
  // curveAdjust == counterclockwise: -1, center or clockwise: 1
  return (direction == 'counterclockwise' ? -1 : 1);
}

export function lineDetails(a: PointType, b: PointType): LineDetailsType {

  const length = Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);

  const angle = Math.atan2(
    (b.y - a.y),
    (b.x - a.x)
  );

  const midPoint = {
    x: (a.x + b.x) / 2,
    y: (a.y + b.y) / 2
  };

  const normalAngle = angle + (Math.PI / 2); // +/-90, in radians

  return { a, b, length, angle, normalAngle, midPoint }
}

export function distanceToLine(lp1: PointType, lp2: PointType, p0: PointType) {
  // https://en.wikipedia.org/wiki/Distance_from_a_point_to_a_line#Line_defined_by_two_points
  return (
    Math.abs((lp2.y - lp1.y) * p0.x - (lp2.x - lp1.x) * p0.y + lp2.x * lp1.y - lp2.y * lp1.x)
    /
    Math.sqrt((lp2.y - lp1.y)**2 + (lp2.x - lp1.x)**2)
  )
}

export function lineIntersects(lp1: PointType, lp2: PointType, p0: PointType, radius: number) {
  // Since the line extends from inside the graph rectangle to outside the rectangle,
  // and all the systems are within that rectangle... if the line does not pass within the radius
  // of the other system, then it does not intersect that other system.
  const distance = distanceToLine(lp1, lp2, p0);
  return distance
    <= radius;
}

export function PtFromPtLengthAngle(a: PointType, length: number, angle: number) {
  return {
    x: Math.cos(angle) * length + a.x,
    y: Math.sin(angle) * length + a.y
  }
}

export function getQuadControlPoint(normalAngle: number, curveRadius: number, midPoint: PointType, direction: DrawDirectionType): PointType {

  const directionAdjust = direction === 'clockwise' ? 0 : Math.PI;

  return PtFromPtLengthAngle(midPoint, curveRadius, normalAngle - Math.PI + directionAdjust);

}

export function getCubicParameters(a: PointType, b: PointType, curveRadius: number, direction: DrawDirectionType = 'center') {

  const {normalAngle} = lineDetails(a, b);

  const leanFactor = 0.25; // This is 45 degrees
  const leanAngle = (Math.PI * leanFactor);

  const cubicAngle1 =
  direction === 'clockwise'
      ? (normalAngle - Math.PI + leanAngle)
      : (normalAngle - leanAngle)
  const cubicAngle2=
    direction === 'clockwise'
      ? (normalAngle - Math.PI - leanAngle)
      : (normalAngle + leanAngle)

  const cubicControlPoint1 = PtFromPtLengthAngle(a, curveRadius, cubicAngle1);
  const cubicControlPoint2 = PtFromPtLengthAngle(b, curveRadius, cubicAngle2);

  return { cubicControlPoint1, cubicControlPoint2 };
}

export function getQuadrant(pos: PointType, viewBox: ViewBoxType): 1 | 2 | 3 | 4 {
  let quadrant = 1 as 1 | 2 | 3 | 4;
  if (pos) {
    const { x, y } = pos;
    const { x: left, y: top, width, height } = viewBox;
    if (typeof top !== 'undefined' && typeof height !== 'undefined'
      && typeof left !== 'undefined' && typeof width !== 'undefined'
    ) {
      const horizMidpoint = (width-left) / 2;
      const vertMidpoint = (height-top) / 2;
      if (x < horizMidpoint && y < vertMidpoint) {
        quadrant = 2;
      } else if (x < horizMidpoint && y >= vertMidpoint) {
        quadrant = 3;
      } else if (x >= horizMidpoint && y >= vertMidpoint) {
        quadrant = 4;
      }
    }
  }
  return quadrant;
}

export { intersectBezierLine, type LineType, type BezierCubicLineType };
