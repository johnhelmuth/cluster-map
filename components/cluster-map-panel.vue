<script lang="ts" setup>

import type {ClusterModelInterface} from "~/types/ClusterTypes.js";
import type {SystemModelInterface} from "~/types/SystemTypes";
import type {RoutePlanRefType} from "~/types/RoutePlannerTypes";
import {type MapStylesStoreKeyType, type MapStylesStoreType, useMapStyles} from "~/stores/use-map-styles";
import {useModalStateStore} from "~/stores/use-modal-state-store";

const props = defineProps<{
  cluster?: ClusterModelInterface | undefined,
  plan?: RoutePlanRefType
}>();

const emit = defineEmits<{
  "system-selected": [system: SystemModelInterface];
}>();

const {setCurrentOpenModal, closeModal} = useModalStateStore('clusterStyleModal', mapViewClosed);

const mapStylesStore = useMapStyles();

const showMapView = ref(false);

const isDebug = computed(() => mapStylesStore.debug);

const clusterOrientation = computed(() => {
  switch (mapStylesStore.mapStyle) {
    case 'linear':
    case 'circular':
      return 'landscape';
    case 'data':
      return props?.cluster?.orientation || 'landscape';
  }
});

const otherOrientation = computed(() => {
  return oppositeOrientation(clusterOrientation.value);
});

function selectSystem(system: SystemModelInterface | undefined) {
  if (!system) {
    return;
  }
  emit('system-selected', system);
}

function mapView() {
  setCurrentOpenModal();
  showMapView.value = true;
}

function mapViewChanged(newMapViewStyles: MapStylesStoreType) {
  for (const propName of ['debug', 'mapStyle'] as Array<MapStylesStoreKeyType>) {
    if (newMapViewStyles.hasOwnProperty(propName)) {
      // @ts-ignore - I don't know why I get a complaint about mapStylesStore[propname].
      mapStylesStore[propName] = newMapViewStyles[propName];
    }
  }
}

function mapViewClosed() {
  showMapView.value = false;
  closeModal();
}

</script>

<template>
  <div class="cluster-map-panel">
    <!-- TODO: Move the 2 sets of systems/straits into a single SVG file and use CSS to
          show/hide the SVG group (<g>) tags as appropriate. Then see about doing a SVG transition between the two
          groups.
    . -->
    <SVGClusterGraph
        v-if="cluster"
        :class="[clusterOrientation, mapStylesStore.mapStyle]"
        :cluster="cluster"
        :plan="plan"
        @system-selected="selectSystem"
        :debug="isDebug"
        :mapStyle="mapStylesStore.mapStyle"
    />
    <SVGClusterGraph
        v-if="cluster && clusterOrientation !== 'square'"
        :class="[otherOrientation, mapStylesStore.mapStyle]"
        :cluster="cluster"
        :plan="plan"
        @system-selected="selectSystem"
        :debug="isDebug"
        :mapStyle="mapStylesStore.mapStyle"
        :rotate-cluster="true"/>

    <MapLegend class="map-legend"/>

    <Icon class="map-control" name="material-symbols:eye-tracking-outline-rounded" @click="mapView"/>

    <MapClusterStyleModal
        v-model="showMapView"
        @closed="mapViewClosed"
        @changed="mapViewChanged"
        :debug="mapStylesStore.debug"
        :mapStyle="mapStylesStore.mapStyle"
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
