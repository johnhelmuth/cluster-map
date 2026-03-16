<script setup lang="ts">

import {useClustersStore} from "~/stores/use-clusters-store";
import type {ClusterModelInterface} from "~/types/ClusterTypes";
import type {SystemModelInterface} from "~/types/SystemTypes";
import {useUserScopeStore} from "~/stores/use-user-scope-store";

const clustersStore = useClustersStore();

defineProps<{
  cluster?: ClusterModelInterface | undefined
}>();

const emit = defineEmits<{
  "system-selected": [system: SystemModelInterface];
}>();

const { routePlannerService } = useUserScopeStore();

const originSystem = computed(() => routePlannerService.originSystem)
const destinationSystem = computed(() => routePlannerService.destinationSystem)
const isInterClusterTrip = computed(() => {
  return originSystem.value?.cluster !== destinationSystem.value?.cluster;
})

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
  const clusterSlug = targetSelect.value;
  if (clusterSlug) {
    navigateTo({name: 'map-clusterSlug', params: {clusterSlug}});
  }
}

</script>

<template>
  <div class="cluster-map-controls">
    <h1>
      <select class="clusterSelect" @change="clusterSelected">
        <option v-if="! cluster" disabled selected>
          No Cluster Selected
        </option>
        <option v-for="clusterItem in clustersStore.clusters.clusters"
                :value="clusterItem.slug"
                :key="clusterItem.id"
                :id="clusterItem.id"
                :selected="clusterItem === cluster"
        >
          {{ clusterItem.name }}
        </option>
      </select>
    </h1>
    <div v-if="originSystem || destinationSystem" class="route-options-container">
      <h2>Desired route</h2>
      <span v-if="originSystem" class="origin-system">
        {{ originSystem.name }}<span v-if="isInterClusterTrip"> in {{ originSystem.cluster.name }}</span>
      </span>
      <span v-if="destinationSystem" class="origin-system">
         to {{ destinationSystem.name }}<span v-if="isInterClusterTrip"> in {{ destinationSystem.cluster.name }}</span>
      </span>
    </div>
    <div class="systems-list-container">
      <div class="control-group">
        <h2>Systems</h2>
        <div v-if="!! cluster?.systems" class="controls">
          <Icon id="accordion-button" class="button-icon accordion-button" @click="expandCards"
                :name="expandCollapseIcon"/>
        </div>
      </div>
    </div>
    <div class="panel-body">
      <SystemInfoCard
          v-if="!! cluster?.systems" class="systems-list"
          v-for="system in cluster?.systems || [] as Array<SystemModelInterface | undefined>"
          :system="system"
          :key="system.id"
          @selected="selectSystem"
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

.control-group {
  margin-top: 0.25rem;
  display: flex;
  flex-direction: row;
  font-size: 1rem;
  align-items: center;
}

.control-group h2 {
  flex: 1 1 auto;
}

.controls .button-icon {
  margin: 0 0.5rem;
}

.panel-body {
  font-size: .75rem;
  margin-top: 0.25rem;
  overflow-y: auto;
}
</style>