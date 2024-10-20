

<script setup lang="ts">

import SystemInfoCard from "@/components/SystemInfoCard.vue";
import type {SystemModelInterface} from "@/types/SystemTypes.js";
import type {ClusterModelInterface} from "@/types/ClusterTypes";
import type {RoutePlanType} from "@/types/RoutePlannerTypes";
import {createRoutePlanner} from "@/utilities/RoutePlanner";
import {ref} from "vue";

const props = defineProps<{
  cluster: ClusterModelInterface,
  selectedSystems: Map<SystemId, { seq: Number, system: SystemModelInterface }>,
  plan?: RoutePlanType;
}>();

let systemInfoCardClosed = ref(true);

const emit = defineEmits<{
  "system-selected": (system: SystemModelInterface) => void;
  "route-planned": (plan: RoutePlanType) => void;
}>();

function expandCards() {
  console.log('expandCards() clicked. systemInfoCardClosed.value: ', systemInfoCardClosed.value)
  systemInfoCardClosed.value = ! systemInfoCardClosed.value;
  document.getElementById('accordion-button').innerText =
    systemInfoCardClosed.value
      ? 'Expand'
      : 'Collapse';
}

function selectSystem(system: SystemModelInterface) {
  system.toggleSelected();
  emit('system-selected', system);
  console.log('selectSystem() props.selectedSystems.value.size: ', props.selectedSystems.size);
  if (props.selectedSystems.size === 2) {
    planTrip();
  } else {
    emit('route-planned', null);
  }
}

function planTrip() {
  console.log('planTrip()')
  const [systemA, systemB] = [...props.selectedSystems.values()].map(value => value.system);
  console.log('planTrip() [systemA, systemB]: ', [systemA, systemB]);
  const routePlanner = createRoutePlanner(props.cluster);
  console.log('planTrip() routePlanner: ', routePlanner);
  const routePlan = routePlanner.plan(systemA, systemB);
  console.log('planTrip() routePlan: ', routePlan);
  emit('route-planned', routePlan);
}

</script>

<template>
  <div class="cluster-map-controls">
    <h1>{{ cluster.name ? cluster.name : "Cluster"}}</h1>
    <div class="controls">
      <button id="accordion-button" @click="expandCards">Expand</button>
    </div>
    <div class="panel-body">
      <SystemInfoCard v-for="system in cluster.systems"
                      :system="system"
                      :key="system.id"
                      @selected="selectSystem"
                      :plan="plan"
                      :system-info-card-closed="systemInfoCardClosed"
      />
    </div>
  </div>
</template>

<style scoped>

h1 {
  color: var(--color-heading);
  border-radius: 0.5rem;
  box-shadow: inset -0.1rem -0.1rem 0.1rem grey,
              inset 0.1rem 0.1rem 0.1rem lightgrey;
  padding: 0.5rem;
  text-align: center;
}
.controls {
  margin-top: 0.25rem;
  display: flex;
  flex-direction: row-reverse;
}
.controls button {
  background-color: var(--color-background);
  border: none;
  border-radius: 0.25rem;
  width: 5rem;
  height: 1.5rem;
  box-shadow: inset -0.1rem -0.1rem 0.1rem grey,
  inset 0.1rem 0.1rem 0.1rem lightgrey;
}
.controls button:hover {
  box-shadow:
    inset 0.1rem 0.1rem 0.1rem grey,
    inset -0.1rem -0.1rem 0.1rem lightgrey;
}
.panel-body {
  margin-top: 0.25rem;
  overflow-y: scroll;
}
.cluster-map-controls {
  border-radius: 0.5rem;
  padding: 0 1em;
  margin-left: 1rem;
  display: flex;
  flex-direction: column;
  height: 100%;
}

@media (max-width: 1024px) {
  .cluster-map-controls {
    border-radius: 0.25rem;
    padding: 0 0.25rem;
    margin-left: 0.5rem;
  }
}
</style>
