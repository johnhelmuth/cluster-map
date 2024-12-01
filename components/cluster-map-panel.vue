<script lang="ts" setup>

import type { ClusterModelInterface } from "~/types/ClusterTypes.js";
import type { SystemModelInterface } from "~/types/SystemTypes";
import type { RoutePlanRefType } from "~/types/RoutePlannerTypes";
import {useMapStyles} from "~/stores/use-map-styles";

const props = defineProps<{
  cluster?: ClusterModelInterface | undefined,
  plan?: RoutePlanRefType
}>();

const emit = defineEmits<{
  "system-selected": [system: SystemModelInterface];
}>();

const mapStylesStore = useMapStyles();

const showMapView = ref(false);

const isDebug = computed(() => mapStylesStore.debug);

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
  showMapView.value = true;
}

function mapViewChanged(newMapViewStyles) {
  for (const propName of ['debug', 'mapStyle', 'straightStraits']) {
    if (newMapViewStyles.hasOwnProperty(propName)) {
      mapStylesStore[propName] = newMapViewStyles[propName];
    }
  }
}

function mapViewClosed() {
  showMapView.value = false;
}

</script>

<template>
  <div class="cluster-map-panel">
    <!-- TODO: Move the 2 sets of systems/straits into a single SVG file and use CSS to
          show/hide the SVG group (<g>) tags as appropriate. Then see about doing a SVG transition between the two
          groups.
    . -->
    <SVGClusterGraph :class="[cluster.orientation, mapStylesStore.mapStyle]"
                     :cluster="cluster"
                     :plan="plan"
                     @system-selected="selectSystem"
                     :debug="isDebug"
                     :mapStyle="mapStylesStore.mapStyle"
                     :straight-straits="mapStylesStore.straightStraits"
    />
    <SVGClusterGraph
        v-if="cluster.orientation !== 'square' && mapStylesStore.mapStyle !== 'circular'"
        :class="[otherOrientation, mapStylesStore.mapStyle]"
        :cluster="cluster"
        :plan="plan"
        @system-selected="selectSystem"
        :debug="isDebug"
        :mapStyle="mapStylesStore.mapStyle"
        :straight-straits="mapStylesStore.straightStraits"
        :rotate-cluster="true"/>

    <Icon class="map-control" name="material-symbols:eye-tracking-outline-rounded" @click="mapView"/>

    <MapClusterStyleModal
        v-model="showMapView"
        @closed="mapViewClosed"
        @changed="mapViewChanged"
        :debug="mapStylesStore.debug"
        :mapStyle="mapStylesStore.mapStyle"
        :straightStraits="mapStylesStore.straightStraits"
    />
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

.cluster-map-panel .map-control {
  color: white;
  height: 1rem;
  width: 1rem;
  position: absolute;
  right: .4rem;
  top: .4rem;
  padding: .7rem;
}

</style>
