<script setup lang="ts">

import {useClustersStore} from "~/stores/use-clusters-store";
import type {ClusterModelInterface} from "~/types/ClusterTypes";
import type {RoutePlanRefType} from "~/types/RoutePlannerTypes";
import type {SystemModelInterface} from "~/types/SystemTypes";

const clustersStore = useClustersStore();

defineProps<{
  cluster?: ClusterModelInterface | undefined,
  plan?: RoutePlanRefType,
}>();

const emit = defineEmits<{
  "system-selected": [system: SystemModelInterface];
  "cluster-selected": [cluster: ClusterModelInterface];
}>();

const iconExpandedName = 'material-symbols:expand-all-rounded'
const iconCollapsedName = 'material-symbols:collapse-all-rounded'
const expandCollapseIcon = ref(iconExpandedName);

const systemInfoCardClosed = ref(true);

function expandCards() {
  systemInfoCardClosed.value = !systemInfoCardClosed.value;
  expandCollapseIcon.value = systemInfoCardClosed.value ? iconExpandedName : iconCollapsedName;
}

function selectSystem(system: SystemModelInterface | undefined) {
  if (!system) {
    return;
  }
  emit('system-selected', system);
}

function clusterSelected(event: Event) {
  const targetSelect = event.target as HTMLSelectElement;
  const clusterId = targetSelect.value;
  const newCluster = clustersStore.clusters.getClusterById(clusterId);
  if (newCluster) {
    emit('cluster-selected', newCluster);
  }
}

</script>

<template>
  <div class="cluster-map-controls">
    <h1>
      <select class="clusterSelect" @change="clusterSelected">
        <option v-for="clusterItem in clustersStore.clusters.clusters"
                :value="clusterItem.id"
                :key="clusterItem.id"
                :id="clusterItem.id"
                :selected="clusterItem === cluster"
        >
          {{ clusterItem.name }}
        </option>
      </select>
    </h1>
    <div class="controls">
      <Icon id="accordion-button" class="button-icon accordion-button" @click="expandCards"
            :name="expandCollapseIcon"/>
    </div>
    <div class="panel-body">
      <SystemInfoCard v-if="!! cluster?.systems"
                      v-for="system in cluster?.systems || [] as Array<SystemModelInterface | undefined>"
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

h1 > select {
  border: none;
  appearance: none;
  width: 100%;
  text-align: center;
  font-size: .75rem;
  font-weight: bold;
  background: none;
  color: var(--color-heading);
}

.controls {
  margin-top: 0.25rem;
  display: flex;
  flex-direction: row;
  font-size: 1rem;
  justify-content: flex-end;
}

.controls .button-icon {
  margin: 0.25rem 0.5rem;
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
  box-shadow: inset 0.1rem 0.1rem 0.1rem grey,
  inset -0.1rem -0.1rem 0.1rem lightgrey;
}

.panel-body {
  font-size: .75rem;
  margin-top: 0.25rem;
  overflow-y: scroll;
}
</style>