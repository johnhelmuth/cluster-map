import {
  getCubicParameters,
  getQuadControlPoint,
  lineDetails
} from "~/utils/geometry";
import type {DrawDirectionType} from "~/types/StraitTypes";

export function pathStraight(a: PointType, b: PointType) {
  return [
    `M ${a.x} ${a.y}`,
    `L ${b.x} ${b.y}`
  ].join(' ');
}

export function curveCubic(a: PointType, b: PointType, curveRadius: number, direction: DrawDirectionType) {

  const {cubicControlPoint1, cubicControlPoint2 } =
    getCubicParameters(a, b, curveRadius, direction);

  return [
    `M ${a.x} ${a.y}`,
    `C ${cubicControlPoint1.x} ${cubicControlPoint1.y}, ${cubicControlPoint2.x} ${cubicControlPoint2.y}, ${b.x} ${b.y}`
  ].join(' ');
}

export function curveQuadratic(a: PointType, b: PointType, curveRadius: number, direction: DrawDirectionType) {

  const { normalAngle, midPoint } = lineDetails(a, b);
  const quadControlPoint = getQuadControlPoint(normalAngle, curveRadius, midPoint, direction);

  return [
    `M ${a.x} ${a.y}`,
    `Q ${quadControlPoint.x} ${quadControlPoint.y}, ${b.x} ${b.y}`
  ].join(' ');
}

export function curveArc(
  a: PointType, b: PointType, curveRadius: number,
  xAxisRotation: 0 | 1 = 0,
  largeArcFlag: 0 | 1 = 0,
  sweepFlag: 0 | 1 = 0
) {
  return [
    `M ${a.x} ${a.y}`,
    `A ${curveRadius} ${curveRadius} ${xAxisRotation} ${largeArcFlag} ${sweepFlag} ${b.x} ${b.y}`
  ].join(' ');
}
