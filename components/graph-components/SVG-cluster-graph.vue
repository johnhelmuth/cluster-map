<script setup lang="ts">

import type {ClusterModelInterface} from "@/types/ClusterTypes";
import type {SystemModelInterface} from "@/types/SystemTypes";
import type {MapViewStylesType} from "~/types/BasicTypes";
import type {ViewBoxType} from "~/utils/geometry";

const props = defineProps<{
  cluster: ClusterModelInterface,
  debug: boolean,
  mapStyle: MapViewStylesType,
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

const viewBoxValues = computed(() => {
  const { top, left, width, height } = getMapDimensions();
  const viewBox = { x: top, y: left, width: width, height: height } as ViewBoxType;
  if (shouldRotate.value) {
    return { ...viewBox, width: viewBox.height, height: viewBox.width }
  }
  return viewBox;
})

const viewBox = computed(() => {
  return `${viewBoxValues.value.x} ${viewBoxValues.value.y} ${viewBoxValues.value.width} ${viewBoxValues.value.height}`;
});

function selectSystem(system: SystemModelInterface | undefined) {
  if (!system) {
    return;
  }
  emit('systemSelected', system);
}

</script>

<template>
  <SVGMap :viewBox="viewBox" :class="shouldRotate ? 'is-rotating' : ''"
          preserveAspectRatio="xMidYMid meet" >
    <template v-if="debug" v-slot:background>
      <rect v-if="viewBoxValues" id="viewBoxRect"
            :x="viewBoxValues.x"
            :y="viewBoxValues.y"
            :width="viewBoxValues.width"
            :height="viewBoxValues.height"
            stroke-width="5"
            stroke="purple"
            stroke-opacity="0.25"
            fill="black"
      />
    </template>
    <template v-slot:straits>
      <template v-for="[systemId, straits] in cluster.getStraitsInSystemOrder()">
        <template v-for="(strait, index) in straits" :key="index">
          <StraitGraph :strait="strait" :index="index"
                       :data-systemId="systemId"
                       :debug="debug"
                       :mapStyle="mapStyle"
                       :should-rotate="shouldRotate"
          />
        </template>
      </template>
    </template>
    <template v-slot:cluster-straits>
      <template v-if="cluster.hasClusterStraits()">
        <ClusterStraitGraph
            v-if="cluster.hasClusterStraits()"
            v-for="(clusterStrait, index) in cluster.getClusterStraits()"
            :key="clusterStrait.id"
            :index="index"
            :cluster="cluster"
            :clusterStrait="clusterStrait"
            :viewBoxValues="viewBoxValues"
            :data-clusterStraitId="clusterStrait.id"
            :debug="debug"
            :mapStyle="mapStyle"
            :should-rotate="shouldRotate"
        />
      </template>
    </template>
    <template v-slot:systems>
      <template v-if="true" v-for="system in cluster.systems" :key="system.id">
        <SystemGraph
            :system="system"
            :mapStyle="mapStyle"
            :id="system.id"
            @selected="selectSystem"
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
        <line x1="500" y1="0" x2="500" y2="1000" stroke="red" stroke-opacity="1"/>
        <line x1="0" y1="375" x2="1000" y2="375" stroke="red" stroke-opacity="1"/>

        <line x1="375" y1="0" x2="375" y2="1000" stroke="green" stroke-width="2" stroke-opacity="1"/>
        <line x1="0" y1="500" x2="1000" y2="500" stroke="green" stroke-width="2" stroke-opacity="1"/>
      </template>
    </template>
  </SVGMap>
</template>

<style scoped>

</style>
