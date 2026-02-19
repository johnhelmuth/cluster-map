<script setup lang="ts">

import {
  type boxType,
  chartBox,
  datumLabelSize,
  type datumType,
  percentageGridLines, type pointData, statsDataPoints
} from "~/utils/chart-utils";

import {useChartPopover} from "~/composables/use-chart-popover";

const props = defineProps<{
  viewBox: [number, number, number, number],
  statsData: datumType[]
}>();

const width = computed(() => (props.viewBox[2] - props.viewBox[0]));
const height = computed(() => (props.viewBox[3] - props.viewBox[1]));

const labelTextSize = computed(() => datumLabelSize(props.statsData));

const barAreaBox = computed(() => chartBox(props.statsData, width.value, height.value));

function getBarBox(datum: pointData, index: number): boxType {
  const {x, y, percentage} = datum;
  const barWidth = (barAreaBox.value.xStep * 0.8);
  const barHeight = percentage * barAreaBox.value.gridScaleY;
  return {x: x - Math.floor(barWidth / 2), y, width: barWidth, height: barHeight, datum};
}

const bars = computed(() => {
  const statsDataPointsData = statsDataPoints(props.statsData, width.value, height.value);
  if (props.statsData.length && statsDataPointsData && statsDataPoints.length) {
    const bars = [] as boxType[];
    for (let i = 0; i < statsDataPointsData.length; i++) {
      const datum = statsDataPointsData[i];
      if (datum) {
        const box = getBarBox(datum, i);
        if (box) {
          bars.push(box);
        }
      }
    }
    return bars;
  }
})

const percentGridLines = computed(() => percentageGridLines(props.statsData, width.value, height.value));

const { showPopover, hidePopover, popoverVisible, currentDatum, currMousePosition } = useChartPopover();

</script>

<template>
  <div class="bar-graph">
    <svg :viewBox="viewBox.join(' ')" xmlns="http://www.w3.org/2000/svg">
      <template v-if="statsData.length" v-for="bar of bars">
        <rect :x="bar.x"
              :y="bar.y"
              :width="bar.width"
              :height="bar.height"
              stroke="none" fill="darkgrey"
              @mouseenter="(e: MouseEvent) => showPopover(e, bar.datum)"
              @mouseleave="hidePopover"
        />
        <text :x="barAreaBox.x + bar.x" :y="height - 30" :font-size="labelTextSize">
          {{ bar.datum.label }}
        </text>
      </template>
      <template v-if="percentGridLines.length" v-for="({percentage, y}) of percentGridLines">
        <text x="0" :y="y" font-size="24">{{ percentage }}%</text>
        <line x1="60" :y1="y" :x2="width" :y2="y" stroke="black" stroke-width="1"/>
      </template>
    </svg>
    <DatumPopover :show="popoverVisible" :datum="currentDatum" :position="currMousePosition"/>
  </div>
</template>

<style scoped>

</style>