import type {SystemModelInterface} from "@/types/SystemTypes.js";
import type {PointType} from "@/types/GeometryTypes.js";

export function getBoundingBox(systems: SystemModelInterface[]) : {
  upperLeft: PointType;
  lowerRight: PointType;
} {

  const upperLeft: PointType = { x: Number.MAX_SAFE_INTEGER, y: Number.MAX_SAFE_INTEGER };
  const lowerRight: PointType = { x: Number.MIN_SAFE_INTEGER, y: Number.MIN_SAFE_INTEGER }

  systems.forEach((system: SystemModelInterface) => {
    const { x, y } = system.position;
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
