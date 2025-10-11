
export type PointType = {
  x: number;
  y: number;
  z?: number;
}

export function isPointType(point: any): point is PointType {
  return (
    point?.x && typeof point?.x === 'number'
    && point?.y && typeof point?.y === 'number'
    && (! point?.z || typeof point?.z === 'number')
  )
}
