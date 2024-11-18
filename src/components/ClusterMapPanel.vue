<script setup lang="ts">

import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {faEye} from '@fortawesome/free-solid-svg-icons';
import type {ClusterModelInterface} from "@/types/ClusterTypes.js";
import type {SystemModelInterface} from "@/types/SystemTypes";
import type {RoutePlanRefType} from "@/types/RoutePlannerTypes";
import {useMapViewStyleModal} from "@/components/Modals/useMapViewStyleModal";
import SVGClusterGraph from "@/components/graph-components/SVGClusterGraph.vue";

const props = defineProps<{
  cluster: ClusterModelInterface,
  plan?: RoutePlanRefType;
}>();

const emit = defineEmits<{
  "system-selected": [system: SystemModelInterface];
}>();

const { mapStyle, straightStraits, debug, mapViewTypeModal, clusterOrientation } = useMapViewStyleModal();

function selectSystem(system: SystemModelInterface | undefined) {
  if (! system) {
    return;
  }
  emit('system-selected', system);
}

function mapView() {
  mapViewTypeModal.open();
}

</script>

<template>
  <div class="cluster-map-panel">
    <!-- Use this SVG if the aspect ratio matches the positions in the data. -->
    <SVGClusterGraph :cluster="cluster" :plan="plan" @system-selected="selectSystem" :debug="debug" :straight-straits="straightStraits" />
    <FontAwesomeIcon class="map-control" :icon="faEye" @click="mapView"/>
    <p v-if="debug">{{ mapStyle }}</p>
    <p v-if="debug">{{ clusterOrientation }}</p>
  </div>

</template>

<style scoped>

.cluster-map-panel {
  width: 100%;
  height: 100%;
  position: relative;
}

.cluster-map-panel svg {
  width: 100%;
  height: 100%;
  display: block;
}

.cluster-map-panel svg.map-control {
  color: white;
  height: 1rem;
  width: 1rem;
  position: absolute;
  right: 0;
  top: 0;
  padding: 0.4rem;
}

</style>
