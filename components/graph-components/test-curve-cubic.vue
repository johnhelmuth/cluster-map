<script setup lang="ts">

import {curveCubic, pathStraight} from "~/utils/svg-utils";
import type {DrawDirectionType} from "~/types/StraitTypes";
import {getCubicParameters, lineDetails, PtFromPtLengthAngle, intersectBezierLine, type BezierCubicLineType, type LineType} from "~/utils/geometry";

const props = defineProps<{
  curve: BezierCubicLineType;
  iLine: LineType;
  curveRadius: number;
  direction: DrawDirectionType;
  testIntersect: boolean;
}>();

const path = computed(() => {
  console.groupCollapsed('path');
  const x = props.direction !== 'center'
      ? curveCubic(props.curve[0], props.curve[3], props.curveRadius, props.direction)
      : pathStraight(props.curve[0], props.curve[3]);
  console.groupEnd();
  return x;
})

const lineDeets = computed(() => lineDetails(props.curve[0], props.curve[3]));

const normalEnd = computed(() => {
  return PtFromPtLengthAngle(lineDeets.value.midPoint, props.curveRadius, lineDeets.value.normalAngle)
})

const controlPoints = computed(() => {
  if (typeof props.curve[0] !== 'undefined' && typeof props.curve[3] !== 'undefined' && typeof props.direction !== 'undefined' && props.direction !== 'center') {
    console.group('controlPoints computed');
    const x = getCubicParameters(props.curve[0], props.curve[3], props.curveRadius, props.direction);
    console.groupEnd();
    return x;
  }
})

const intersectingPoints = computed(() => {
  if (typeof controlPoints.value !== 'undefined') {
    const intersects = intersectBezierLine(
        [props.curve[0], controlPoints.value.cubicControlPoint1, controlPoints.value.cubicControlPoint2, props.curve[3]],
        props.iLine
    );
    console.log('intersectingPoints: intersects: ', intersects);
    return intersects;
  }
})

</script>

<template>
  <div class="curve-container">
    <svg viewBox="0 0 500 500" preserveAspectRatio="xMidYMid meet">
      <rect x="0" y="0" width="500" height="500" stroke="black" stroke-width="2" fill="none"/>
      <g class="curve-cubic">
        <!-- Cubic curve path -->
        <path
            :d="path"
            fill="none"
            stroke="black"
            stroke-width="2"
        />
      </g>
      <g class="curve-debug">
        <!-- Base line and endpoints -->
        <line :x1="curve[0].x" :y1="curve[0].y" :x2="curve[3].x" :y2="curve[3].y" stroke="black" stroke-width="1" stroke-dasharray="5 5"/>
        <circle :cx="curve[0].x" :cy="curve[0].y" r="3" fill="black"/>
        <text :x="curve[0].x-20" :y="curve[0].y">a</text>
        <circle :cx="curve[3].x" :cy="curve[3].y" r="3" fill="black"/>
        <text :x="curve[3].x+10" :y="curve[3].y">b</text>

        <!-- Base line mid, normal, and control points. -->
        <circle :cx="lineDeets.midPoint.x" :cy="lineDeets.midPoint.y" r="3" fill="blue"/>
        <circle :cx="normalEnd.x" :cy="normalEnd.y" r="3" fill="blue"/>
        <circle v-if="controlPoints" :cx="controlPoints.cubicControlPoint1.x"
                :cy="controlPoints.cubicControlPoint1.y"
                r="3" fill="red"/>
        <circle v-if="controlPoints" :cx="controlPoints.cubicControlPoint2.x"
                :cy="controlPoints.cubicControlPoint2.y"
                r="3" fill="red"/>

        <!-- Base line normal line -->
        <line v-if="lineDeets.midPoint && normalEnd" :x1="lineDeets.midPoint.x" :y1="lineDeets.midPoint.y"
              :x2="normalEnd.x" :y2="normalEnd.y" stroke="blue" stroke-width="1"/>

        <!-- Curve lines to control points -->
        <line v-if="controlPoints" :x1="curve[0].x" :y1="curve[0].y" :x2="controlPoints.cubicControlPoint1.x"
              :y2="controlPoints.cubicControlPoint1.y" stroke="purple" stroke-width="1"/>
        <line v-if="controlPoints" :x1="curve[3].x" :y1="curve[3].y" :x2="controlPoints.cubicControlPoint2.x"
              :y2="controlPoints.cubicControlPoint2.y" stroke="purple" stroke-width="1"/>

        <!-- Possibly intersecting line and endpoints -->
        <g v-if="testIntersect && iLine" class="intersecting-line">
          <line :x1="iLine[0].x" :y1="iLine[0].y" :x2="iLine[1].x" :y2="iLine[1].y" stroke="green" stroke-opacity=".5"/>
          <circle :cx="iLine[0].x" :cy="iLine[0].y" r="3" fill="green"/>
          <circle :cx="iLine[1].x" :cy="iLine[1].y" r="3" fill="green"/>
          <!-- Intersection points -->
          <g v-if="intersectingPoints" class="intersecting-points">
            <circle v-for="p in intersectingPoints"
                    :cx="p.x" :cy="p.y" r="3" fill="green"
            />
          </g>
        </g>
      </g>
    </svg>
    <div class="label">
      <p>({{ curve[0].x.toFixed(2) }}, {{ curve[0].y.toFixed(2) }}) - ({{ curve[3].x.toFixed(2) }}, {{ curve[3].y.toFixed(2) }})</p>
      <p>{{ direction }}, radius = {{ curveRadius }}</p>
      <p v-if="testIntersect">Test intersect</p>
      <p v-if="$slots.extraLabel">
        <slot name="extraLabel"></slot>
      </p>
    </div>
  </div>
</template>

<style scoped>
svg {
  background-color: rgb(from yellow r g b / 5%);
}

.label {
  text-align: center;
}
</style>