import {
  getCubicParameters,
  getQuadControlPoint,
  lineDetails
} from "~/utils/geometry";
import type {DrawDirectionType} from "~/types/StraitTypes";
import {fround} from "~/utils/utils";

export function pathStraight(a: PointType, b: PointType) {
  return [
    `M ${fround(a.x)} ${fround(a.y)}`,
    `L ${fround(b.x)} ${fround(b.y)}`
  ].join(' ');
}

export function curveCubic(a: PointType, b: PointType, curveRadius: number, direction: DrawDirectionType) {

  const {cubicControlPoint1, cubicControlPoint2 } =
    getCubicParameters(a, b, curveRadius, direction);

  return [
    `M ${fround(a.x)} ${fround(a.y)}`,
    `C ${fround(cubicControlPoint1.x)} ${fround(cubicControlPoint1.y)}, ${fround(cubicControlPoint2.x)} ${fround(cubicControlPoint2.y)}, ${fround(b.x)} ${fround(b.y)}`
  ].join(' ');
}

export function curveQuadratic(a: PointType, b: PointType, curveRadius: number, direction: DrawDirectionType) {

  const { normalAngle, midPoint } = lineDetails(a, b);
  const quadControlPoint = getQuadControlPoint(normalAngle, curveRadius, midPoint, direction);

  return [
    `M ${fround(a.x)} ${fround(a.y)}`,
    `Q ${fround(quadControlPoint.x)} ${fround(quadControlPoint.y)}, ${fround(b.x)} ${fround(b.y)}`
  ].join(' ');
}

export function curveArc(
  a: PointType, b: PointType, curveRadius: number,
  xAxisRotation: 0 | 1 = 0,
  largeArcFlag: 0 | 1 = 0,
  sweepFlag: 0 | 1 = 0
) {
  return [
    `M ${fround(a.x)} ${fround(a.y)}`,
    `A ${fround(curveRadius)} ${fround(curveRadius)} ${xAxisRotation} ${largeArcFlag} ${sweepFlag} ${fround(b.x)} ${fround(b.y)}`
  ].join(' ');
}
