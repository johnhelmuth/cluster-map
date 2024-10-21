<script setup lang="ts">

import type {ClusterModelInterface} from "@/types/ClusterTypes.js";

import {computed, ref} from 'vue'

import SystemGraph from "@/components/graph-components/SystemGraph.vue";
import StraitGraph from "@/components/graph-components/StraitGraph.vue";
import type {SystemIdType, SystemModelInterface} from "@/types/SystemTypes";
import type {RoutePlanType} from "@/types/RoutePlannerTypes";
import { getBoundingBox } from '@/utilities/utils';
import SVGMap from "@/components/SVGMap.vue";

const props = defineProps<{
  cluster: ClusterModelInterface,
  selectedSystems: Map<SystemIdType, { seq: Number, system: SystemModelInterface }>,
  plan?: RoutePlanType;
}>();

const systems = ref(props.cluster.systems);
const straits = ref(props.cluster.straits);
const boundingBox = computed(() => {
  return getBoundingBox(props.cluster.systems);
});
const aspectRatio = computed(() => {
  const { upperLeft, lowerRight } = boundingBox.value;
  return Math.abs(lowerRight.x - upperLeft.x) / Math.abs(lowerRight.y - upperLeft.y);
});
const isLandscape = computed(() => {
  return aspectRatio.value >= 1.0
});
const orientation = computed(() => { return isLandscape.value ? 'landscape' : 'portrait' });
const orientationFlipped = computed(() => { return isLandscape.value ? 'portrait' : 'landscape' });

const viewBoxForAspectRatio = computed(() => {
  return isLandscape.value
    ? '0 0 1000 750'
    : '0 0 750 1000';
});
const viewBoxFor90degrees = computed(() => {
  return isLandscape.value
    ? '0 0 750 1000'
    : '0 0 1000 750';
});

</script>

<template>
  <div class="cluster-map-panel">

    <!-- Use this SVG if the aspect ratio matches the positions in the data. -->
    <SVGMap :class="orientation" :viewBox="viewBoxForAspectRatio">

      <template v-slot:straits>
        <template v-for="strait in straits">
          <StraitGraph :strait="strait" :plan="plan"/>
        </template>
      </template>

      <template v-slot:systems>
        <template v-for="system in systems" :key="system.id" >
          <SystemGraph :system="system" :id="system.id" :plan="plan"></SystemGraph>
        </template>
      </template>
    </SVGMap>

    <!-- Use this SVG if the aspect ratio is opposite from the aspect ratio of the positions in the data. -->
    <SVGMap :class="orientationFlipped" :viewBox="viewBoxFor90degrees">

      <template v-slot:straits>
        <template v-for="strait in straits">
          <StraitGraph :strait="strait" :plan="plan" flipped />
        </template>
      </template>

      <template v-slot:systems>
        <template v-for="system in systems" :key="system.id" >
          <SystemGraph :system="system" :id="system.id" :plan="plan" flipped />
        </template>
      </template>
    </SVGMap>

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
  display: block;
}

.cluster-map-panel svg.portrait {
  display: none;
}
@media (orientation: portrait) {
  .cluster-map-panel svg.portrait {
    display: block;
  }
  .cluster-map-panel svg.landscape {
    display: none;
  }
}

</style>
