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

watch(props, (newProps) => {
  console.log('newProps: ', newProps);
})

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
                       :debug="debug"
                       :mapStyle="mapStyle"
                       :straightStraits="straightStraits"
                       :should-rotate="shouldRotate"
          />
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
          :should-rotate="shouldRotate"
        ></SystemGraph>
      </template>
    </template>
  </SVGMap>
</template>

<style scoped>

</style>
