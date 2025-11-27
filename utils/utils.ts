import type {PointType} from "@/types/GeometryTypes.js";
import type {ClustersModelDataType} from "@/types/ClusterTypes";
import type {BoundingBoxType, ClusterOrientationType, PositionThing, PositionThingList} from "@/types/BasicTypes";
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

export function isClustersModelDataType(data : object | ClustersModelDataType) : data is ClustersModelDataType {
  const hasCurrentClusterId = ((data as ClustersModelDataType)?.currentClusterId !== undefined);
  return hasCurrentClusterId
    && typeof (data as ClustersModelDataType).currentClusterId === 'string'
    && (data as ClustersModelDataType).clusters !== undefined
    && ((data as ClustersModelDataType).clusters?.length === 0 || (data as ClustersModelDataType).clusters?.length > 0)
}

/**
 * Is an element in the viewport, i.e. "above the fold"?
 *
 * Lifted from https://www.javascripttutorial.net/dom/css/check-if-an-element-is-visible-in-the-viewport/
 *
 * @param el {HTMLElement}
 *
 * @returns boolean
 */
export function isInViewport(el: HTMLElement) {
  if (import.meta.client) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }
  return true;
}

/**
 * Pads a string `s` with leading zeros so that it has exactly `totDigits` characters.
 *
 * @param s
 * @param totDigits
 *
 * @returns {string}
 */
export function leadingZeros(s: string, totDigits: number) {
  const prefixedS = '0'.repeat(totDigits) + s;
  return prefixedS.substring(prefixedS.length - totDigits);
}

export function dateFormat(d: Date) {
  const dateYear = d.getFullYear().toString();
  const dateMonth = leadingZeros((d.getMonth() + 1).toString(10),2);
  const dateDayOfMonth = leadingZeros(d.getDate().toString(10), 2);
  return [dateYear, dateMonth, dateDayOfMonth].join('-');
}