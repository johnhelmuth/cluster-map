<script setup lang="ts">

import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {faEye} from '@fortawesome/free-solid-svg-icons';
import type {ClusterModelInterface} from "@/types/ClusterTypes.js";
import type {SystemModelInterface} from "@/types/SystemTypes";
import type {RoutePlanRefType} from "@/types/RoutePlannerTypes";
import {useMapViewStyleModal} from "@/components/Modals/useMapViewStyleModal";
import SVGClusterGraph from "@/components/graph-components/SVGClusterGraph.vue";
import {computed} from "vue";
import {oppositeOrientation} from "@/utilities/utils";

const props = defineProps<{
  cluster: ClusterModelInterface,
  plan?: RoutePlanRefType;
}>();

const emit = defineEmits<{
  "system-selected": [system: SystemModelInterface];
}>();

const { mapStylesStore, mapViewTypeModal } = useMapViewStyleModal();

const otherOrientation = computed(() => {
  return oppositeOrientation(props.cluster.orientation);
});

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
    <!-- TODO: Move the 2 sets of systems/straits into a single SVG file and use CSS to
          show/hide the SVG group (<g>) tags as appropriate. Then see about doing a SVG transition between the two
          groups.
    . -->
    <SVGClusterGraph :class="cluster.orientation" :cluster="cluster" :plan="plan" @system-selected="selectSystem" :debug="mapStylesStore.debug" :straight-straits="mapStylesStore.straightStraits"  />
    <SVGClusterGraph
      v-if="cluster.orientation !== 'square' && mapStylesStore.mapStyle !== 'circular'"
      :class="otherOrientation" :cluster="cluster" :plan="plan" @system-selected="selectSystem" :debug="mapStylesStore.debug" :straight-straits="mapStylesStore.straightStraits" :rotate-cluster="true"/>
    <FontAwesomeIcon class="map-control" :icon="faEye" @click="mapView"/>
  </div>

</template>

<style scoped>

.cluster-map-panel {
  width: 100%;
  height: 100%;
  position: relative;
  container-type: size;
  container-name: map-panel;
}

.cluster-map-panel svg {
  width: 100%;
  height: 100%;
  display: block;
}

.cluster-map-panel svg.landscape {
  display: block;
}

.cluster-map-panel svg.portrait {
  display: none;
}

@container map-panel (orientation: portrait) {
  .cluster-map-panel svg.landscape {
    display: none;
  }

  .cluster-map-panel svg.portrait {
    display: block;
  }
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
