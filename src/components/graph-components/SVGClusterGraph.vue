<script setup lang="ts">

import SVGMap from "@/components/SVGMap.vue";
import StraitGraph from "@/components/graph-components/StraitGraph.vue";
import SystemGraph from "@/components/graph-components/SystemGraph.vue";
import type {ClusterModelInterface} from "@/types/ClusterTypes";
import type {RoutePlanRefType} from "@/types/RoutePlannerTypes";
import type {SystemModelInterface} from "@/types/SystemTypes";
import {useMapStyles} from "@/utilities/useMapStyles";
const { mapStyle } = useMapStyles();

defineProps<{
  cluster: ClusterModelInterface,
  plan?: RoutePlanRefType,
  debug: boolean,
  straightStraits: boolean
}>();

const emit = defineEmits<{
  systemSelected: [system: SystemModelInterface | undefined]
}>();

function selectSystem(system: SystemModelInterface | undefined) {
  if (! system) {
    return;
  }
  emit('systemSelected', system);
}

</script>

<template>
  <SVGMap class="landscape" viewBox="0 0 1000 750" >
    <template v-slot:straits>
      <template v-for="[systemId, straits] in cluster.getStraitsInSystemOrder()">
        <template v-for="(strait, index) in straits" :key="index">
          <StraitGraph :strait="strait" :plan="plan" :index="index" :data-systemId="systemId" :debug="debug" :straightStraits="straightStraits" />
        </template>
      </template>
    </template>
    <template v-slot:systems>
      <template v-for="system in cluster.systems" :key="system.id" >
        <SystemGraph
          :system="system"
          :mapStyle="mapStyle"
          :id="system.id"
          @selected="selectSystem"
          :plan="plan"
        ></SystemGraph>
      </template>
    </template>
  </SVGMap>
</template>

<style scoped>

</style>
