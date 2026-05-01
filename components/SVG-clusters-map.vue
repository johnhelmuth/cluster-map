<script setup lang="ts">

import {useClustersStore} from "~/stores/use-clusters-store";
import {type ViewBoxType} from "~/utils/geometry";
import type {ClusterStraitPosition} from "~/utils/LayoutService";

type PositionedObjectType<T> = {
  id: string;
  data: T;
  position: PointType;
}

const props = defineProps<{
  viewBox: ViewBoxType
}>();

const viewBoxC = computed(() => {
  if (layoutService.value.viewBox) {
    return layoutService.value.viewBox;
  }
  return props.viewBox;
});

const viewBoxString = computed(() => {
  return `${viewBoxC.value.x} ${viewBoxC.value.y} ${viewBoxC.value.width} ${viewBoxC.value.height}`;
});

const clustersStore = useClustersStore();

const layoutService = computed(() => (new LayoutService(clustersStore.clusters,
    {
      iterations: 10000,
      physicsSettings: {
        springLength: 40
      }
    })));

function getPathForStraitPosition(straitPos: ClusterStraitPosition) {
  return `M ${straitPos.fromPosition.x} ${straitPos.fromPosition.y} L  ${straitPos.toPosition.x} ${straitPos.toPosition.y}`
}



</script>

<template>
  <div>
    <svg :viewBox="viewBoxString" xmlns="http://www.w3.org/2000/svg"
         preserveAspectRatio="xMidYMid meet">
      <rect class="background" :x="viewBoxC.x" :y="viewBoxC.y" :width="viewBoxC.width" :height="viewBoxC.height"/>

      <template v-if="layoutService.straits.length" v-for="straitPos in layoutService.straitPositions()">
        <path :id="`strait-${straitPos.strait.id.replace(/:/g,'-')}`" :d="getPathForStraitPosition(straitPos)" stroke-width="5" stroke="orange"/>
      </template>

      <template v-if="layoutService.clusters.length"
                v-for="(clusterPosition, index) in layoutService.clusterPositions()">
        <circle :cx="clusterPosition.position.x" :cy="clusterPosition.position.y" r="30" fill="black" fill-opacity="1"/>
        <SVGClusterGraph
            class="cluster-icon"
            :cluster="clusterPosition.cluster"
            :debug="false"
            mapStyle="circular"
            :hide-cluster-straits="true"
            width="100" height="100"
            :x="clusterPosition.position.x-50"
            :y="clusterPosition.position.y-50"
        />
<!--        <circle :cx="clusterPosition.position.x" :cy="clusterPosition.position.y" r="5" fill="red" fill-opacity="1"/>-->
        <text class="cluster-id" :x="clusterPosition.position.x-(clusterPosition.cluster.name.length)"
              :y="clusterPosition.position.y">
          {{ clusterPosition.cluster.name }}
        </text>
      </template>
    </svg>
  </div>
</template>

<style scoped>
.cluster-id {
  fill: white;
}

.strait-direction {
  fill: white;
}

.cluster-icon {
  /* fill: url(#cluster-radialgradient); */
}
</style>