<script setup lang="ts">

import type {StraitModelInterface} from "@/types/StraitTypes";
import type {RoutePlanRefType} from "@/types/RoutePlannerTypes";
import type {MapViewStylesType} from "~/types/BasicTypes";
import {systemRadiusByStyleAndNumberOfSystems} from '~/utils/cluster-generator'

const props = defineProps<{
  strait: StraitModelInterface,
  plan?: RoutePlanRefType,
  index: number,
  debug: boolean,
  mapStyle: MapViewStylesType,
  shouldRotate: boolean,
}>();

const sysAPos = computed(() => {
  return props.strait.systemA.getPosition(props.mapStyle, props.shouldRotate);
})
const sysBPos = computed(() => {
  return props.strait.systemB.getPosition(props.mapStyle, props.shouldRotate);
})

const isInRoutePlan = computed(() => {
  if (props.plan?.value) {
    let lastSystem = null;
    for (const system of props.plan.value) {
      if (lastSystem !== null) {
        if (props.strait.includes(lastSystem) && props.strait.includes(system)) {
          return true;
        }
      }
      lastSystem = system;
    }
  }
  return false;
});


const numSystems = computed(() => props.strait.systemA.cluster.numSystems);

const radius = computed(() => systemRadiusByStyleAndNumberOfSystems(props.mapStyle, numSystems.value));

const straitParams = computed(() => props.strait.straitParameters(props.index, props.mapStyle, props.shouldRotate, radius.value));

const path = computed(() => {

  const {straitLength, quadControlPoint, cubicControlPoint1, cubicControlPoint2, pathType, curveRadius } = straitParams.value;

  let straitPath = `M ${sysAPos.value.x} ${sysAPos.value.y} `;

  if (pathType === 'straight' || straitLength < radius.value) {
    straitPath += `L ${sysBPos.value.x} ${sysBPos.value.y}`;

  } else if (pathType === 'curved') {
    const useQuadratic = false;
    if (useQuadratic) {
      straitPath += `Q ${quadControlPoint.x} ${quadControlPoint.y}, ${sysBPos.value.x} ${sysBPos.value.y}`;
    } else {
      straitPath += `C ${cubicControlPoint1.x} ${cubicControlPoint1.y}, ${cubicControlPoint2.x} ${cubicControlPoint2.y}, ${sysBPos.value.x} ${sysBPos.value.y}`;
    }
  } else if (pathType === 'arc') {
    const xAxisRotation = 0;
    const largeArcFlag = 0;
    const sweepFlag = 0; // (props.index % 2 === 0) ? 0 : 1;

    straitPath += `A ${curveRadius} ${curveRadius} ${xAxisRotation} ${largeArcFlag} ${sweepFlag} ${sysBPos.value.x} ${sysBPos.value.y}`;
  }
  return straitPath;
});

const midPoint = computed(() => {
  return straitParams.value.straitMidPoint;
});

</script>

<template>

  <g class="strait" :class="{'in-route-plan' : isInRoutePlan }" :id="strait.id" :data-index="index">
    <path class="main" :d="path" fill="none"/>
    <path class="selected" :d="path" fill="none"/>
    <template v-if="debug">
      <circle :cx="midPoint.x" :cy="midPoint.y" r="5" fill="pink"/>
      <circle :cx="straitParams.quadControlPoint.x" :cy="straitParams.quadControlPoint.y" r="5" fill="red"/>
      <circle :cx="straitParams.cubicControlPoint1.x" :cy="straitParams.cubicControlPoint1.y" r="5" fill="red"/>
      <circle :cx="straitParams.cubicControlPoint2.x" :cy="straitParams.cubicControlPoint2.y" r="5" fill="red"/>
      <line :x1="sysAPos.x" :y1="sysAPos.y" :x2="sysBPos.x" :y2="sysBPos.y" fill="none" stroke="purple" stroke-width="5px" stroke-opacity="0.5"></line>
      <line :x1="midPoint.x" :y1="midPoint.y" :x2="straitParams.quadControlPoint.x" :y2="straitParams.quadControlPoint.y" fill="none" stroke="yellow" stroke-width="5px" stroke-opacity="0.5"></line>
      <line :x1="sysAPos.x" :y1="sysAPos.y" :x2="straitParams.cubicControlPoint1.x" :y2="straitParams.cubicControlPoint1.y" fill="none" stroke="orange" stroke-width="5px" stroke-opacity="0.5"></line>
      <line :x1="sysBPos.x" :y1="sysBPos.y" :x2="straitParams.cubicControlPoint2.x" :y2="straitParams.cubicControlPoint2.y" fill="none" stroke="orange" stroke-width="5px" stroke-opacity="0.5"></line>
      <text :x="midPoint.x" :y="midPoint.y" stroke="white">{{index}}</text>
      <text :x="midPoint.x+20" :y="midPoint.y+20" stroke="white">{{(strait.getDrawDirection(mapStyle))}}</text>
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
