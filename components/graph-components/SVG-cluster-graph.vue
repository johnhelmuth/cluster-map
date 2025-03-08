<script setup lang="ts">

import type {ClusterModelInterface} from "@/types/ClusterTypes";
import type {RoutePlanRefType} from "@/types/RoutePlannerTypes";
import type {SystemModelInterface} from "@/types/SystemTypes";
import type {MapViewStylesType} from "~/types/BasicTypes";

const props = defineProps<{
  cluster: ClusterModelInterface,
  plan?: RoutePlanRefType,
  debug: boolean,
  mapStyle: MapViewStylesType,
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

const viewBox = computed(() => {
  if (shouldRotate.value) {
    return "0 0 750 1000";
  }
  return "0 0 1000 750";
});

function selectSystem(system: SystemModelInterface | undefined) {
  if (!system) {
    return;
  }
  emit('systemSelected', system);
}

</script>

<template>
  <SVGMap :viewBox="viewBox" :class="shouldRotate ? 'is-rotating' : ''">
    <template v-slot:straits>
      <template v-for="[systemId, straits] in cluster.getStraitsInSystemOrder()">
        <template v-for="(strait, index) in straits" :key="index">
          <StraitGraph :strait="strait" :plan="plan" :index="index"
                       :data-systemId="systemId"
                       :debug="debug"
                       :mapStyle="mapStyle"
                       :straightStraits="straightStraits"
                       :should-rotate="shouldRotate"
          />
        </template>
      </template>
    </template>
    <template v-slot:systems>
      <template v-if="true" v-for="system in cluster.systems" :key="system.id">
        <SystemGraph
            :system="system"
            :mapStyle="mapStyle"
            :id="system.id"
            @selected="selectSystem"
            :plan="plan"
            :should-rotate="shouldRotate"
        ></SystemGraph>
      </template>
      <template v-if="debug">
        <template v-for="x in 11">
          <template v-for="y in 11">
            <line :x1="(x-1) * 100" y1="0" :x2="(x-1) * 100" y2="1000" stroke="grey" stroke-opacity="0.5"/>
            <line x1="0" :y1="(y-1)*100" x2="1000" :y2="(y-1)*100" stroke="grey" stroke-opacity="0.5"/>
          </template>
        </template>
        <line x1="500" y1="0" x2="500" y2="1000" stroke="red" stroke-opacity="0.5"/>
        <line x1="0" y1="375" x2="1000" y2="375" stroke="red" stroke-opacity="0.5"/>

        <line x1="375" y1="0" x2="375" y2="1000" stroke="green" stroke-width="2" stroke-opacity="0.5"/>
        <line x1="0" y1="500" x2="1000" y2="500" stroke="green" stroke-width="2" stroke-opacity="0.5"/>
      </template>
    </template>
  </SVGMap>
</template>

<style scoped>

</style>
