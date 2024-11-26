<script setup lang="ts">

import type {StraitModelInterface} from "@/types/StraitTypes";
import {computed} from "vue";
import type {RoutePlanRefType} from "@/types/RoutePlannerTypes";
import {getMapDimensions, systemRadiusByStyleAndNumberOfSystems} from "@/utilities/ClusterGenerator";
import {useMapStyles} from "@/utilities/useMapStyles";

const props = defineProps<{
  strait: StraitModelInterface,
  plan?: RoutePlanRefType,
  index: number,
  debug: boolean,
  straightStraits: boolean,
  shouldRotate: boolean,
}>();

const mapStylesStore = useMapStyles();

const systemAX = computed(() => props.shouldRotate ? props.strait.systemA.rotatePosition().x : props.strait.systemA.position.x );
const systemAY = computed(() => props.shouldRotate ? props.strait.systemA.rotatePosition().y : props.strait.systemA.position.y );
const systemBX = computed(() => props.shouldRotate ? props.strait.systemB.rotatePosition().x : props.strait.systemB.position.x );
const systemBY = computed(() => props.shouldRotate ? props.strait.systemB.rotatePosition().y : props.strait.systemB.position.y );

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

  const straitParams = props.strait.straitParameters(props.index);
  const {straitLength} = straitParams;
  const pathType = (props.straightStraits ? 'straight' : 'arc') as 'straight' | 'arc' | 'curved' ;
  const curveRadius = Math.min(width, height) / 2 - Math.min(borderX, borderY);

  let straitPath = `M ${systemAX.value} ${systemAY.value} `;

  if (pathType === 'straight' || straitLength < radius) {
    straitPath += `L ${systemBX.value} ${systemBY.value}`;

  } else if (pathType === 'curved') {

    const { controlPoint } = straitParams;

    straitPath += `Q ${controlPoint.x} ${controlPoint.y}, ${systemBX.value} ${systemBY.value}`;
  } else if (pathType === 'arc') {

    const xAxisRotation = 0;
    const largeArcFlag = 0;
    const sweepFlag = (props.index % 2 === 0) ? 0 : 1;

    straitPath += `A ${curveRadius} ${curveRadius} ${xAxisRotation} ${largeArcFlag} ${sweepFlag} ${systemBX.value} ${systemBY.value}`;
  }
  return straitPath;
});

const midPoint = computed(() => {
  return props.strait.straitParameters(props.index).straitMidPoint;
});

const controlPoint = computed(() => {
  return props.strait.straitParameters(props.index).controlPoint;
})

</script>

<template>

  <g class="strait" :class="{'in-route-plan' : isInRoutePlan}" :id="strait.id" :data-index="index">
<!--    <line v-if="debug" class="main" :x1="systemAX" :y1="systemAY" :x2="systemBX" :y2="systemBY"></line>-->
<!--    <line v-if="debug" class="selected" :x1="systemAX" :y1="systemAY" :x2="systemBX" :y2="systemBY"></line>-->
    <line v-if="debug" :x1="systemAX" :y1="systemAY" :x2="systemBX" :y2="systemBY" fill="none" stroke="purple" stroke-width="5px"></line>
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
