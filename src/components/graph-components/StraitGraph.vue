<script setup lang="ts">

import type {StraitModelInterface} from "@/types/StraitTypes";
import {computed} from "vue";
import type {RoutePlanType} from "@/types/RoutePlannerTypes";

const props = defineProps<{
  strait: StraitModelInterface,
  plan?: RoutePlanType
}>();

const systemAX = computed(() => props.strait.systemA.position.x );
const systemAY = computed(() => props.strait.systemA.position.y );
const systemBX = computed(() => props.strait.systemB.position.x );
const systemBY = computed(() => props.strait.systemB.position.y );
const isInRoutePlan = computed(() => {
  if (props.plan) {
    let lastSystem = null;
    for (const system of props.plan) {
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
  filter: url(#blur1);
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
  filter: url(#blur1);
  animation: 2s ease-in-out 0.1s infinite alternate strait-throb;
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
