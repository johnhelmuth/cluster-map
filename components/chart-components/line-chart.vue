<script setup lang="ts">

import {datumLabelSize, percentageGridLines, type pointData, statsDataPoints} from "~/utils/chart-utils";
import type {PointType} from "~/types/GeometryTypes";
import {useChartPopover} from "~/composables/use-chart-popover";

const props = defineProps<{
  viewBox: [number, number, number, number],
  statsData: datumType[]
}>();

const width = computed(() => (props.viewBox[2] - props.viewBox[0]));
const height = computed(() => (props.viewBox[3] - props.viewBox[1]));

const labelTextSize = computed(() => datumLabelSize(props.statsData));

const statsDataPointsData = computed(() => statsDataPoints(props.statsData, width.value, height.value))

/**
 * Consider using something like this to make smooth path between all the points.
 *
 * https://www.stkent.com/2015/07/03/building-smooth-paths-using-bezier-curves.html
 */
const statsDataPath = computed(() => {
  if (statsDataPointsData.value?.length) {
    return 'M ' + statsDataPointsData.value.map(({x, y}) => `${x},${y}`).join(' L ');
  }
})

const percentGridLines = computed(() => percentageGridLines(props.statsData, width.value, height.value));

const { showPopover, hidePopover, popoverVisible, currentDatum, currMousePosition } = useChartPopover();

</script>

<template>
  <div class="line-graph">
    <svg :viewBox="viewBox.join(' ')" xmlns="http://www.w3.org/2000/svg">
      <path :d="statsDataPath" fill="none" stroke="black" stroke-width="2" />
      <template v-if="statsDataPointsData?.length" v-for="p in statsDataPointsData">
        <circle :cx="p.x" :cy="p.y" r="10" fill="blue" stroke="none"
                :data-label="p.label"
                :data-value="p.value"
                :data-percentage="p.percentage"
                @mouseenter="(e: MouseEvent) => showPopover(e, p)"
                @mouseleave="hidePopover"
        />
        <text :x="p.x" :y="height - 30" :font-size="labelTextSize">
          {{ p.label }}
        </text>
      </template>
      <template v-if="percentGridLines.length" v-for="({percentage, y}) of percentGridLines">
        <text x="0" :y="y" font-size="24">{{ percentage }}%</text>
        <line x1="60" :y1="y" :x2="width" :y2="y" stroke="grey" stroke-width="1"/>
      </template>
    </svg>
    <DatumPopover :show="popoverVisible" :datum="currentDatum" :position="currMousePosition"/>
  </div>
</template>

<style scoped>

</style>