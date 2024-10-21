<script setup lang="ts">

import type {ClusterModelInterface} from "@/types/ClusterTypes.js";

import {ref} from 'vue'

import SystemGraph from "@/components/graph-components/SystemGraph.vue";
import StraitGraph from "@/components/graph-components/StraitGraph.vue";
import type {SystemIdType, SystemModelInterface} from "@/types/SystemTypes";
import type {RoutePlanType} from "@/types/RoutePlannerTypes";

const props = defineProps<{
  cluster: ClusterModelInterface,
  selectedSystems: Map<SystemIdType, { seq: Number, system: SystemModelInterface }>,
  plan?: RoutePlanType;
}>();

const systems = ref(props.cluster.systems);
const straits = ref(props.cluster.straits);

console.log('systems: ', systems);
console.log('straits: ', straits);
console.log('props.plan: ', props.plan);

</script>

<template>
  <div class="cluster-map-panel">
    <svg viewBox="0 0 1000 750" xmlns="http://www.w3.org/2000/svg">
      <filter id="blur1">
        <feGaussianBlur stdDeviation="3" />
      </filter>
      <filter id="blur2">
        <feGaussianBlur stdDeviation="2" />
      </filter>
      <template v-for="strait in straits">
        <StraitGraph :strait="strait" :plan="plan"/>
      </template>
      <template v-for="system in systems" :key="system.id" >
        <SystemGraph :system="system" :id="system.id" :plan="plan"></SystemGraph>
      </template>
    </svg>
  </div>
</template>

<style scoped>

.cluster-map-panel {
  width: 100%;
  height: 100%;
}

.cluster-map-panel svg {
  width: 100%;
  height: 100%;
}


</style>
