<script setup lang="ts">

import type {ClusterModelInterface} from "@/types/ClusterTypes.js";

import {computed} from 'vue'

import SystemGraph from "@/components/graph-components/SystemGraph.vue";
import StraitGraph from "@/components/graph-components/StraitGraph.vue";
import type {SystemModelInterface} from "@/types/SystemTypes";
import type {RoutePlanRefType} from "@/types/RoutePlannerTypes";
import { getBoundingBox } from '@/utilities/utils';
import SVGMap from "@/components/SVGMap.vue";

const props = defineProps<{
  cluster: ClusterModelInterface,
  plan?: RoutePlanRefType;
}>();

const emit = defineEmits<{
  "system-selected": [system: SystemModelInterface];
}>();

function selectSystem(system: SystemModelInterface | undefined) {
  if (! system) {
    return;
  }
  emit('system-selected', system);
}

const boundingBox = computed(() => {
  return getBoundingBox(props.cluster.systems);
});
const aspectRatio = computed(() => {
  const { upperLeft, lowerRight } = boundingBox.value;
  return Math.abs(lowerRight.x - upperLeft.x) / Math.abs(lowerRight.y - upperLeft.y);
});
const isLandscape = computed(() => {
  console.log('aspectRatio.value: ', aspectRatio.value);
  console.log('boundingBox.value: ', boundingBox.value);
  return true; // aspectRatio.value >= 1.0
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
    <SVGMap :class="orientation" :viewBox="viewBoxForAspectRatio" >
      <template v-slot:straits>
        <template v-for="strait in cluster.straits">
          <StraitGraph :strait="strait" :plan="plan"/>
        </template>
      </template>
      <template v-slot:systems>
        <template v-for="system in cluster.systems" :key="system.id" >
          <SystemGraph
            :system="system"
            :id="system.id"
            @selected="selectSystem"
            :plan="plan"
          ></SystemGraph>
        </template>
      </template>
    </SVGMap>

<!--    &lt;!&ndash; Use this SVG if the aspect ratio is opposite from the aspect ratio of the positions in the data. &ndash;&gt;-->
<!--    <SVGMap :class="orientationFlipped" :viewBox="viewBoxFor90degrees" preserveAspectRatio="XMidYMid slice">-->

<!--      <template v-slot:straits>-->
<!--        <template v-for="strait in cluster.straits">-->
<!--          <StraitGraph :strait="strait" :plan="plan" flipped />-->
<!--        </template>-->
<!--      </template>-->
<!--      <circle class="center" cx="375" cy="500" r="30" fill="red" stroke="blue"/>-->
<!--      <text class="center" x="375" y="500">Center</text>-->
<!--&lt;!&ndash;      <rect x="0" y="0" width="750" height="1000" stroke="red" fill="none"></rect>&ndash;&gt;-->
<!--      <template v-slot:systems>-->
<!--        <template v-for="system in cluster.systems" :key="system.id" >-->
<!--          <SystemGraph-->
<!--            :system="system"-->
<!--            :id="system.id"-->
<!--            @selected="selectSystem"-->
<!--            :plan="plan"-->
<!--            flipped-->
<!--          />-->
<!--        </template>-->
<!--      </template>-->
<!--    </SVGMap>-->

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
  //width: 1000px;
  //height: 750px;
  display: block;
}

.cluster-map-panel svg.portrait {
  display: none;
}
/* @media (orientation: portrait) {
//  .cluster-map-panel svg.portrait {
//    display: block;
//  }
//  .cluster-map-panel svg.landscape {
//    display: none;
//  }
//} */

svg circle.center {
  fill: red;
  stroke: white;
  stroke-width: 10px;
}

text.center {
  font-size: 0.75rem;
  text-anchor: middle;
  dominant-baseline: middle;
  color: yellow;
}
</style>
