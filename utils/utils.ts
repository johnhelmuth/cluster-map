import type {ClustersModelDataType} from "@/types/ClusterTypes";
import type {ClusterOrientationType} from "@/types/BasicTypes";

export function oppositeOrientation(orientation: ClusterOrientationType) : ClusterOrientationType {
  switch (orientation) {
    case 'landscape':
      return 'portrait';
    case 'portrait':
      return 'landscape';
  }
  return orientation;
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