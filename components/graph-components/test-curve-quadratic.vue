<script setup lang="ts">

import type {DrawDirectionType} from "~/types/StraitTypes";
import {type BezierCubicLineType, getQuadControlPoint, lineDetails, PtFromPtLengthAngle} from "~/utils/geometry";
import {curveQuadratic} from "~/utils/svg-utils";

const props = defineProps<{
  curve: BezierCubicLineType;
  curveRadius: number;
  direction: DrawDirectionType;
}>();

const lineDeets = computed(() => lineDetails(props.curve[0], props.curve[3]));

const normalEnd = computed(() => {
  return PtFromPtLengthAngle(lineDeets.value.midPoint, props.curveRadius, lineDeets.value.normalAngle)
})

const controlPoint = computed(() => {
  if (typeof props.curve[0] !== 'undefined' && typeof props.curve[3] !== 'undefined' && props.direction !== 'center') {
    const {normalAngle, midPoint} = lineDetails(props.curve[0], props.curve[3]);
    return getQuadControlPoint(normalAngle, props.curveRadius, midPoint, props.direction);
  }
})

const path2 = computed(() => {
  return props.direction !== 'center'
    ? curveQuadratic(props.curve[0], props.curve[3], props.curveRadius, props.direction)
      : pathStraight(props.curve[0], props.curve[3]);
})

</script>

<template>
  <div class="curve-container">
    <svg viewBox="0 0 500 500" preserveAspectRatio="xMidYMid meet">
      <rect x="0" y="0" width="500" height="500" stroke="black" stroke-width="2" fill="none"/>
      <g class="curve-quadratic">
        <!-- Line 2 path -->
        <path
            :d="path2"
            fill="none"
            stroke="black"
            stroke-width="2"
        />
      </g>
      <g class="curve-debug">

        <!-- Line 2 and endpoints -->
        <line :x1="curve[0].x" :y1="curve[0].y" :x2="curve[3].x" :y2="curve[3].y" stroke="black" stroke-width="1" stroke-dasharray="5 5"/>
        <circle :cx="curve[0].x" :cy="curve[0].y" r="3" fill="black"/>
        <text :x="curve[0].x-20" :y="curve[0].y">a</text>
        <circle :cx="curve[3].x" :cy="curve[3].y" r="3" fill="black"/>
        <text :x="curve[3].x+10" :y="curve[3].y">b</text>

        <!-- Line 2 mid, normal, and control point. -->
        <circle :cx="lineDeets.midPoint.x" :cy="lineDeets.midPoint.y" r="3" fill="blue"/>
        <circle :cx="normalEnd.x" :cy="normalEnd.y" r="3" fill="blue"/>
        <circle v-if="controlPoint" :cx="controlPoint.x" :cy="controlPoint.y" r="3" fill="red"/>

        <!-- Line 2 normal line -->
        <line v-if="lineDeets.midPoint && normalEnd" :x1="lineDeets.midPoint.x" :y1="lineDeets.midPoint.y"
              :x2="normalEnd.x" :y2="normalEnd.y" stroke="blue" stroke-width="1"/>

        <!-- Line 2 lines to control point -->
        <line v-if="controlPoint" :x1="curve[0].x" :y1="curve[0].y" :x2="controlPoint.x" :y2="controlPoint.y" stroke="purple"
              stroke-width="1"/>
        <line v-if="controlPoint" :x1="curve[3].x" :y1="curve[3].y" :x2="controlPoint.x" :y2="controlPoint.y" stroke="purple"
              stroke-width="1"/>
      </g>
    </svg>
    <div class="label">
      <p>({{ curve[0].x.toFixed(2) }}, {{ curve[0].y.toFixed(2) }}) - ({{ curve[3].x.toFixed(2) }}, {{ curve[3].y.toFixed(2) }})</p>
      <p>{{ direction }}, radius = {{ curveRadius }}</p>
      <p v-if="$slots.extraLabel">
        <slot name="extraLabel"></slot>
      </p>
    </div>
  </div>
</template>

<style scoped>
svg {
  background-color: rgb(from green r g b / 5%);
}
.label {
  text-align: center;
}
</style>