import type {PointType} from "~/types/GeometryTypes";

const heightMarginFactor = 0.8;
const widthMarginFactor = 0.95;

export interface boxType {
  x: number,
  y: number,
  width: number,
  height: number,
  datum: pointData,
}

export interface datumType {
  label: number | string,
  value: number
}

export type pointData = PointType & { label: string|number, value: number, percentage: number };

export function datumLabelSize(statsData: datumType[]) {
  return (statsData.length > 15 ? 32 : 48)
}

export function totalStatsData(statsData: datumType[]) {
  return (statsData.reduce((acc, {value}) => acc + value, 0))
}

export function maxStatsData(statsData: datumType[]) {
  return Math.max(...statsData.map(x => x.value))
}

export function chartBox(statsData: datumType[], width: number, height: number) {
  {
    const chartAreaHeight = height * heightMarginFactor;
    const chartAreaWidth = width * widthMarginFactor;
    const y = Math.floor((height - chartAreaHeight)/2);
    const x = Math.floor((width - chartAreaWidth)/2);
    const maxValue = maxStatsData(statsData);
    const dataTotal = totalStatsData(statsData);

    const highestPercentage = (maxValue / dataTotal) * 100;
    // Round up to the nearest 5% increment
    const maxPercentage = Math.floor((highestPercentage / 5) + 1) * 5;
    const percentPerLine = (maxPercentage < 50 ? 5 : 10);
    const gridScaleY = chartAreaHeight / maxPercentage;
    const xStep = chartAreaWidth / (statsData.length +1);

    return {y, x, height: chartAreaHeight, width: chartAreaWidth, maxPercentage, gridScaleY, percentPerLine, xStep }
  }
}

export function percentageGridLines(statsData: datumType[], width: number, height: number) {
  const {y: chartAreaY, height: chartAreaHeight, gridScaleY, maxPercentage, percentPerLine} = chartBox(statsData, width, height)
  // Round up to the nearest 10% increment
  const nearestAbovePercent10 = Math.floor((maxPercentage / 10) + 1) * 10;
  const gridLines = [] as { percentage: number, y: number }[];
  for (let p = 0; p <= nearestAbovePercent10; p = p + percentPerLine) {
    const y = chartAreaY + chartAreaHeight - p * gridScaleY;
    if (y >= 0) {
      gridLines.push({percentage: p, y});
    }
  }
  return gridLines;
}

export function statsDataPoints(statsData: datumType[]|undefined, width: number, height: number) {
  if (statsData?.length) {
    const chartAreaBox = chartBox(statsData, width, height);
    const dataTotal = totalStatsData(statsData);
    const { gridScaleY } = chartAreaBox;
    const points = [] as pointData[];
    for (let i = 0; i < statsData.length; i++) {
      const datum = statsData[i];
      if (datum) {
        const { label, value } = datum;
        const percentage = (value / dataTotal) * 100;
        const pt = {
          label,
          value,
          percentage,
          x: (i+1) * chartAreaBox.xStep,
          y: chartAreaBox.y + chartAreaBox.height - percentage * gridScaleY,
        }
        points.push(pt);
      }
    }
    return points;
  }
}