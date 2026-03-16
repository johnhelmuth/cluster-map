<script setup lang="ts">

import type {StraitModelInterface, StraitParametersType} from "@/types/StraitTypes";
import type {MapViewStylesType} from "~/types/BasicTypes";
import {systemRadiusByStyleAndNumberOfSystems} from '~/utils/cluster-generator'
import {getCubicParameters, getQuadControlPoint} from "~/utils/geometry";
import {curveArc, curveCubic, curveQuadratic, pathStraight} from "~/utils/svg-utils";
import {useUserScopeStore} from "~/stores/use-user-scope-store";

const props = defineProps<{
  strait: StraitModelInterface,
  index: number,
  debug: boolean,
  mapStyle: MapViewStylesType,
  shouldRotate: boolean,
}>();

const { routePlannerService } = useUserScopeStore();

const sysAPos = computed(() => {
  return props.strait.straitPointA.system.getPosition(props.mapStyle, props.shouldRotate);
})
const sysBPos = computed(() => {
  return props.strait.straitPointB.system.getPosition(props.mapStyle, props.shouldRotate);
})

const isInRoutePlan = computed(() => {
  return routePlannerService.straitInRoutePlan(props.strait);
});


const numSystems = computed(() => props.strait.straitPointA.cluster.numSystems);

const radius = computed(() => systemRadiusByStyleAndNumberOfSystems(props.mapStyle, numSystems.value));


/**
 * Calculates how to curve strait lines on the map, and returns the details for drawing that line.
 *
 * There are only ever 0, 1, 2, or 3 "outgoing" straits from a system, based on the cluster generation system.
 * If there's a strait outgoing from the system, the method calculates the curve parameters for drawing it, in an
 * attempt to make the graph look better, easier to understand.
 *
 * Index 0 is the first outgoing strait.  Every system in the cluster except the last has one of these. It should be
 * drawn as a straight line from the center of this system to the center of the connected system.
 *
 * Index 1 is the second outgoing strait.
 *
 * Index 2 is the third outgoing strait.
 *
 * Algorithm:
 *   Determine which system this is in the cluster. Even numbered (0, 2, 4, etc) arc to the right, when facing the
 *   connected system from the system. Odd numbered systems (1, 3, 5, etc) arc to the left.
 *
 *   Index 0 always goes straight.
 *   Index 1 always arcs out to the chosen direction at a shallow angle, based on the length of the midpoint normal.
 *   Index 2 always arcs out to the chosen direction at a steeper angle.
 *
 * @return {StraitParametersType}
 */
const straitParams = ref(props.debug
    ? {
      length,
      midPoint: {x: 0, y: 0},
      // Include these control points in straitParams for debugging display.
      quadControlPoint: undefined,
      cubicControlPoint1: undefined,
      cubicControlPoint2: undefined,
      pathType: 'curved',
      curveRadius: 0,
    } as StraitParametersType
    : undefined
);

const path = computed(() => {

  const direction = props.strait.getDrawDirection(props.mapStyle);

  const pathType = (props.mapStyle === 'circular' && props.index === 0
          ? 'arc'
          : 'curved'
  );

  const curveRadius = props.strait.curveRadius(props.index, props.mapStyle, radius.value);

  const {a, b, length, normalAngle, midPoint} =
      props.strait.straitLine(props.mapStyle, props.shouldRotate, direction);

  if (props.debug) {
    straitParams.value = {
      length,
      midPoint,
      // Include these control points in straitParams for debugging display.
      quadControlPoint: undefined,
      cubicControlPoint1: undefined,
      cubicControlPoint2: undefined,
      pathType,
      curveRadius,
    };
  }

  let straitPath = pathStraight(sysAPos.value, sysBPos.value);
  if (length >= radius.value) {
    if (pathType === 'curved') {
      const useQuadratic = false;
      if (useQuadratic) {
        straitPath = curveQuadratic(sysAPos.value, sysBPos.value, curveRadius, direction);
        if (straitParams.value) {
          straitParams.value.quadControlPoint = getQuadControlPoint(normalAngle, curveRadius, midPoint, direction);
        }
      } else {
        straitPath = curveCubic(a, b, curveRadius, direction);
        // For debugging
        const {
          cubicControlPoint1,
          cubicControlPoint2
        } = getCubicParameters(a, b, curveRadius, direction);
        if (straitParams.value) {
          straitParams.value = {...straitParams.value, cubicControlPoint1, cubicControlPoint2};
        }
      }
    } else if (pathType === 'arc') {
      straitPath = curveArc(sysAPos.value, sysBPos.value, curveRadius)
    }
  }
  return straitPath;
});

</script>

<template>

  <g class="strait" :class="{'in-route-plan' : isInRoutePlan }" :id="strait.id" :data-index="index">
    <path class="main" :d="path" fill="none"/>
    <path class="selected" :d="path" fill="none"/>
    <template v-if="debug && straitParams">
      <circle :cx="straitParams.midPoint.x" :cy="straitParams.midPoint.y" r="5" fill="pink"/>
      <circle v-if="straitParams.quadControlPoint" :cx="straitParams.quadControlPoint.x"
              :cy="straitParams.quadControlPoint.y" r="5" fill="red"/>
      <circle v-if="straitParams.cubicControlPoint1" :cx="straitParams.cubicControlPoint1.x"
              :cy="straitParams.cubicControlPoint1.y" r="5" fill="red"/>
      <circle v-if="straitParams.cubicControlPoint2" :cx="straitParams.cubicControlPoint2.x"
              :cy="straitParams.cubicControlPoint2.y" r="5" fill="red"/>
      <line :x1="sysAPos.x" :y1="sysAPos.y" :x2="sysBPos.x" :y2="sysBPos.y" fill="none" stroke="purple"
            stroke-width="5px" stroke-opacity="0.5"></line>
      <line v-if="straitParams.quadControlPoint" :x1="straitParams.midPoint.x" :y1="straitParams.midPoint.y"
            :x2="straitParams.quadControlPoint.x" :y2="straitParams.quadControlPoint.y" fill="none" stroke="yellow"
            stroke-width="5px" stroke-opacity="0.5"></line>
      <line v-if="straitParams.cubicControlPoint1" :x1="sysAPos.x" :y1="sysAPos.y"
            :x2="straitParams.cubicControlPoint1.x" :y2="straitParams.cubicControlPoint1.y" fill="none" stroke="orange"
            stroke-width="5px" stroke-opacity="0.5"></line>
      <line v-if="straitParams.cubicControlPoint2" :x1="sysBPos.x" :y1="sysBPos.y"
            :x2="straitParams.cubicControlPoint2.x" :y2="straitParams.cubicControlPoint2.y" fill="none" stroke="orange"
            stroke-width="5px" stroke-opacity="0.5"></line>
      <text :x="straitParams.midPoint.x" :y="straitParams.midPoint.y" stroke="white">{{ index }}</text>
      <text :x="straitParams.midPoint.x+20" :y="straitParams.midPoint.y+20" stroke="white">
        {{ (strait.getDrawDirection(mapStyle)) }}
      </text>
    </template>
  </g>
</template>

<style scoped>
.strait .main {
  stroke: var(--color-highlight);
  stroke-width: 0.75rem;
  filter: blur(3px);
}

.strait.in-route-plan .main {
  stroke-width: 1rem;
}

.strait .selected {
  display: none;
}

.strait.in-route-plan .selected {
  display: block;
  stroke-width: 0.5rem;
  stroke: hsl(180, 100%, 100%, 80%);
  filter: blur(3px);
  animation: 1s ease-in-out 0.1s infinite alternate strait-throb;
}

@keyframes strait-throb {
  from {
    stroke-width: 0.5rem;
  }
  to {
    stroke-width: 1rem;
  }
}

</style>
