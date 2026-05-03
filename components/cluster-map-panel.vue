<script lang="ts" setup>

import type {ClusterModelInterface} from "~/types/ClusterTypes.js";
import type {SystemModelInterface} from "~/types/SystemTypes";
import {useMapStyles} from "~/stores/use-map-styles";
import {useModalStateStore} from "~/stores/use-modal-state-store";
import {useUserScopeStore} from "~/stores/use-user-scope-store";

const props = defineProps<{
  cluster?: ClusterModelInterface | undefined,
  message?: string | undefined,
}>();

const emit = defineEmits<{
  "system-selected": [system: SystemModelInterface];
  "plan-selected": [index: number];
  "swap-endpoints": [];
}>();

const { routePlannerService } = useUserScopeStore();

const {setCurrentOpenModal, closeModal} = useModalStateStore('clusterStyleModal', mapViewClosed);

const mapStylesStore = useMapStyles();

const showMapView = ref(false);

const isDebug = computed(() => mapStylesStore.debug);

const clusterOrientation = computed(() => {
  switch (mapStylesStore.mapStyle) {
    case 'linear':
      return 'landscape';
    case 'circular':
      return 'square';
    case 'data':
      return props?.cluster?.orientation || 'landscape';
    case 'forcedirected':
      return 'square'; // Don't bother with the rotation stuff for now.
  }
});

const otherOrientation = computed(() => {
  return oppositeOrientation(clusterOrientation.value);
});

const planDetailsStartOpened = computed(() => {
  const clusterInCurrentPlan = routePlannerService?.clusterInCurrentPlan(props.cluster);
  return clusterInCurrentPlan;
})

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

function mapViewClosed() {
  showMapView.value = false;
  closeModal();
}

function selectPlan(planIndex: number) {
  emit('plan-selected', planIndex);
}
function swapEndPoints() {
  emit("swap-endpoints");
}


</script>

<template>
    <div class="cluster-map-panel" :class="mapStylesStore.mapStyle">
      <!-- TODO: Move the 2 sets of systems/straits into a single SVG file and use CSS to
            show/hide the SVG group (<g>) tags as appropriate. Then see about doing a SVG transition between the two
            groups.
      . -->
      <SVGClusterGraph
          v-if="cluster"
          :class="[clusterOrientation, mapStylesStore.mapStyle]"
          :cluster="cluster"
          @system-selected="selectSystem"
          :debug="isDebug"
          :mapStyle="mapStylesStore.mapStyle"
      />
      <SVGClusterGraph
          v-if="cluster && clusterOrientation !== 'square'"
          :class="[otherOrientation, mapStylesStore.mapStyle]"
          :cluster="cluster"
          @system-selected="selectSystem"
          :debug="isDebug"
          :mapStyle="mapStylesStore.mapStyle"
          :rotate-cluster="true"
      />

      <MapLegend class="map-legend"/>

      <Icon class="map-control" name="material-symbols:eye-tracking-outline-rounded" @click="mapView"/>

      <MapClusterStyleModal
          v-model="showMapView"
          @closed="mapViewClosed"
          :mapStyleParams="mapStylesStore"
      />

      <MessageBlock v-if="message">
        <div class="message">{{ message }}</div>
      </MessageBlock>
      <MessageBlock v-if="! message && routePlannerService.routePlans?.length">
        <PlanDetails :max-plans-per-group="5" :max_groups="3"
                     :cluster="cluster"
                     :start-opened="planDetailsStartOpened"
                     @plan-selected="selectPlan"
                     @swap="swapEndPoints"
        />
      </MessageBlock>
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
  .cluster-map-panel:not(.circular) svg.landscape {
    display: none;
  }

  .cluster-map-panel:not(.circular) svg.portrait {
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

.message {
  background-color: var(--color-background);
  border-radius: 0.5rem;
  padding: 1rem;
  cursor: wait;
}

</style>
