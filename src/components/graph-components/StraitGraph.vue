<script setup lang="ts">

import type {StraitModelInterface} from "@/types/StraitTypes";
import {computed} from "vue";
import type {RoutePlanRefType} from "@/types/RoutePlannerTypes";

const props = defineProps<{
  strait: StraitModelInterface,
  plan?: RoutePlanRefType,
  /** @property {boolean} flipped - true if the orientation of the map is rotated 90 degrees. */
  flipped?: boolean,
}>();

const systemAX = computed(() => props?.flipped ? props.strait.systemA.positionFlipped.x : props.strait.systemA.position.x );
const systemAY = computed(() => props?.flipped ? props.strait.systemA.positionFlipped.y : props.strait.systemA.position.y );
const systemBX = computed(() => props?.flipped ? props.strait.systemB.positionFlipped.x : props.strait.systemB.position.x );
const systemBY = computed(() => props?.flipped ? props.strait.systemB.positionFlipped.y : props.strait.systemB.position.y );

const isInRoutePlan = computed(() => {
  if (props.plan.value) {
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


</script>

<template>

  <g class="strait" :class="{'in-route-plan' : isInRoutePlan}" :id="strait.id">
    <line class="main" :x1="systemAX" :y1="systemAY" :x2="systemBX" :y2="systemBY"></line>
    <line class="selected" :x1="systemAX" :y1="systemAY" :x2="systemBX" :y2="systemBY"></line>
  </g>

</template>

<style scoped>
.strait line.main {
  stroke: var(--color-highlight);
  stroke-width: 0.75rem;
  filter: blur(3px);
}

.strait.in-route-plan line.main {
  stroke-width: 1rem;
}

.strait line.selected {
  display: none;
}

.strait.in-route-plan line.selected {
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
