<script setup lang="ts">

import SVGMap from "@/components/SVGMap.vue";
import StraitGraph from "@/components/graph-components/StraitGraph.vue";
import SystemGraph from "@/components/graph-components/SystemGraph.vue";
import type {ClusterModelInterface} from "@/types/ClusterTypes";
import type {RoutePlanRefType} from "@/types/RoutePlannerTypes";
import type {SystemModelInterface} from "@/types/SystemTypes";
import {useMapStyles} from "@/utilities/useMapStyles";
import {computed} from "vue";
const mapStylesStore = useMapStyles();

const props = defineProps<{
  cluster: ClusterModelInterface,
  plan?: RoutePlanRefType,
  debug: boolean,
  straightStraits: boolean,
  rotateCluster?: boolean
}>();

const emit = defineEmits<{
  systemSelected: [system: SystemModelInterface | undefined]
}>();

const shouldRotate = computed(() => {
  if (props?.rotateCluster) {
    return true;
  }
  return false;
});

function selectSystem(system: SystemModelInterface | undefined) {
  if (! system) {
    return;
  }
  emit('systemSelected', system);
}

</script>

<template>
  <SVGMap viewBox="0 0 1000 750" :class="shouldRotate ? 'is-rotating' : ''">
    <template v-slot:straits>
      <template v-for="[systemId, straits] in cluster.getStraitsInSystemOrder()">
        <template v-for="(strait, index) in straits" :key="index">
          <StraitGraph :strait="strait" :plan="plan" :index="index"
                       :data-systemId="systemId"
                       :debug="debug" :straightStraits="straightStraits"
                       :should-rotate="shouldRotate"
          />
        </template>
      </template>
    </template>
    <template v-slot:systems>
      <template v-for="system in cluster.systems" :key="system.id" >
        <SystemGraph
          :system="system"
          :mapStyle="mapStylesStore.mapStyle"
          :id="system.id"
          @selected="selectSystem"
          :plan="plan"
          :should-rotate="shouldRotate"
        ></SystemGraph>
      </template>
    </template>
  </SVGMap>
</template>

<style scoped>

</style>
