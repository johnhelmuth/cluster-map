

<script setup lang="ts">

import SystemInfoCard from "@/components/SystemInfoCard.vue";
import type {SystemIdType, SystemModelInterface} from "@/types/SystemTypes.js";
import type {ClusterModelInterface} from "@/types/ClusterTypes";
import type {RoutePlanType} from "@/types/RoutePlannerTypes";
import {ref} from "vue";

defineProps<{
  cluster?: ClusterModelInterface | undefined,
  selectedSystems: Map<SystemIdType, { seq: Number, system: SystemModelInterface }>,
  plan?: RoutePlanType;
}>();

const emit = defineEmits<{
  "system-selected": [system: SystemModelInterface];
}>();

let systemInfoCardClosed = ref(true);

function expandCards() {
  systemInfoCardClosed.value = ! systemInfoCardClosed.value;
  const accordionEl = document.getElementById('accordion-button');
  if (accordionEl) {
    accordionEl.innerText =
      systemInfoCardClosed.value
        ? 'Expand'
        : 'Collapse';
  }
}

function selectSystem(system: SystemModelInterface | undefined) {
  if (! system) {
    return;
  }
  emit('system-selected', system);
}

</script>

<template>
  <div class="cluster-map-controls">
    <h1>{{ cluster?.name ? cluster.name : "Cluster"}}</h1>
    <div class="controls">
      <button id="accordion-button" @click="expandCards">Expand</button>
    </div>
    <div class="panel-body">
      <SystemInfoCard v-if="!! cluster?.systems" v-for="system in cluster?.systems || [] as Array<SystemModelInterface | undefined>"
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

h1 {
  color: var(--color-heading);
  border-radius: 0.5rem;
  box-shadow: inset -0.1rem -0.1rem 0.1rem grey,
              inset 0.1rem 0.1rem 0.1rem lightgrey;
  padding: 0.5rem;
  text-align: center;
  font-size: .75rem;
  font-weight: bold;

}
.controls {
  margin-top: 0.25rem;
  display: flex;
  flex-direction: row-reverse;
  font-size: .65rem;
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
  font-size: .75rem;
  margin-top: 0.25rem;
  overflow-y: scroll;
}
</style>
