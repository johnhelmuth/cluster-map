<script setup lang="ts">

import type {StraitModelInterface} from "@/types/StraitTypes";
import {computed} from "vue";
import type {RoutePlanRefType} from "@/types/RoutePlannerTypes";
import {getMapDimensions, systemRadiusByStyleAndNumberOfSystems} from "@/utilities/ClusterGenerator";
import {useMapStyles} from "@/utilities/useMapStyles";
import {rotatePosition} from "@/utilities/utils";

const props = defineProps<{
  strait: StraitModelInterface,
  plan?: RoutePlanRefType,
  index: number,
  debug: boolean,
  straightStraits: boolean,
  shouldRotate: boolean,
}>();

const mapStylesStore = useMapStyles();

const sysAPos = computed(() => {
  const position = props.strait.systemA.getPosition(mapStylesStore.mapStyle);
  return props.shouldRotate ? rotatePosition(position) : position;
})
const sysBPos = computed(() => {
  const position = props.strait.systemB.getPosition(mapStylesStore.mapStyle);
  return props.shouldRotate ? rotatePosition(position) : position;
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

const path = computed(() => {

  const numSystems = props.strait.systemA.cluster.numSystems;

  const { width, height, borderX, borderY } = getMapDimensions();

  const radius = systemRadiusByStyleAndNumberOfSystems(mapStylesStore.mapStyle, numSystems);

  const straitParams = props.strait.straitParameters(props.index, mapStylesStore.mapStyle);
  const {straitLength} = straitParams;
  const pathType = (props.straightStraits ? 'straight' : 'arc') as 'straight' | 'arc' | 'curved' ;
  const curveRadius = Math.min(width, height) / 2 - Math.min(borderX, borderY);

  let straitPath = `M ${sysAPos.value.x} ${sysAPos.value.y} `;

  if (pathType === 'straight' || straitLength < radius) {
    straitPath += `L ${sysBPos.value.x} ${sysBPos.value.y}`;

  } else if (pathType === 'curved') {

    const { controlPoint } = straitParams;

    straitPath += `Q ${controlPoint.x} ${controlPoint.y}, ${sysBPos.value.x} ${sysBPos.value.y}`;
  } else if (pathType === 'arc') {

    const xAxisRotation = 0;
    const largeArcFlag = 0;
    const sweepFlag = (props.index % 2 === 0) ? 0 : 1;

    straitPath += `A ${curveRadius} ${curveRadius} ${xAxisRotation} ${largeArcFlag} ${sweepFlag} ${sysBPos.value.x} ${sysBPos.value.y}`;
  }
  return straitPath;
});

const midPoint = computed(() => {
  return props.strait.straitParameters(props.index, mapStylesStore.mapStyle).straitMidPoint;
});

const controlPoint = computed(() => {
  return props.strait.straitParameters(props.index, mapStylesStore.mapStyle).controlPoint;
})

</script>

<template>

  <g class="strait" :class="{'in-route-plan' : isInRoutePlan}" :id="strait.id" :data-index="index">
    <line v-if="debug" :x1="sysAPos.x" :y1="sysAPos.y" :x2="sysBPos.x" :y2="sysBPos.y" fill="none" stroke="purple" stroke-width="5px"></line>
    <line v-if="debug" :x1="midPoint.x" :y1="midPoint.y" :x2="controlPoint.x" :y2="controlPoint.y" fill="none" stroke="yellow" stroke-width="5px"></line>
    <path class="main" :d="path" fill="none"/>
    <path class="selected" :d="path" fill="none"/>
    <circle v-if="debug" :cx="midPoint.x" :cy="midPoint.y" r="5" fill="pink"/>
    <circle v-if="debug" :cx="controlPoint.x" :cy="controlPoint.y" r="5" fill="red"/>
    <text v-if="debug" :x="midPoint.x" :y="midPoint.y" stroke="white">{{index}}</text>
    <text v-if="debug" :x="midPoint.x+20" :y="midPoint.y+20" stroke="white">{{(index % 2 === 0 ? 1 : -1)}}</text>
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
