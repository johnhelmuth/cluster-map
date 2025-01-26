<script setup lang="ts">

import {useUniversesStore} from "~/stores/use-universes-store";
import {useUserScopeStore} from '~/stores/use-user-scope-store.ts'
import type {RoutePlannerServiceInterface} from "~/types/RoutePlannerServiceTypes";
import type {SelectedSystemsServiceInterface} from "~/types/SystemsSelectedListTypes";

const universesStore = useUniversesStore();
const { routePlannerService, selectedSystemsService } = useUserScopeStore() as { routePlannerService: RoutePlannerServiceInterface, selectedSystemsService: SelectedSystemsServiceInterface };

onMounted(() => {
  const logLabel = import.meta.client ? 'CLIENT: ' : 'SERVER: ';
  console.log(`${logLabel}map.vue setup() onMounted(): universesStore: `, universesStore);
  console.log(`${logLabel}map.vue setup() onMounted(): universesStore.value: `, universesStore.value);
});

function systemSelected(system: SystemModelInterface) {
  if (universesStore.value.universe.cluster) {
    const selectedSystemsList = selectedSystemsService.getSelectedSystemsForCluster(universesStore.value.universe.cluster);
    if (selectedSystemsList) {
      selectedSystemsList.selectSystem(system);
      planTrip(selectedSystemsList);
    }
  }
}

function planTrip(selectedSystemsList : SelectedSystemsListInterface) {

  if (universesStore.value.universe.cluster) {
    if ( ! selectedSystemsList.maxSelected ) {
      routePlannerService.deleteRoutePlanForCluster(universesStore.value.universe.cluster);
      return;
    }
    const routePlan = routePlannerService.getRoutePlanForCluster(universesStore.value.universe.cluster);
    if ( ! routePlan) {
      return;
    }
    const [systemA, systemB] = selectedSystemsList.selectedSystems;
    if (! universesStore.value.universe.cluster) {
      throw new Error("No cluster created in ClusterMapControlsPanel.");
    }
    const routePlanner = createRoutePlanner(universesStore.value.universe.cluster);
    const routePlanRaw = routePlanner.plan(systemA, systemB);
    if (routePlanRaw) {
      routePlan.value = routePlanRaw;
    }
  }
}

function clusterSelected(newCluster: ClusterModelInterface) : void {
  universesStore.value.universe.cluster = newCluster;
}

</script>

<template>
  <Bezels>
    <template v-slot:display>
      <ClusterMapPanel
          v-if="universesStore.universe.cluster"
          :cluster="universesStore.universe.cluster"
          @system-selected="systemSelected"
          :plan="routePlannerService.getRoutePlanForCluster(universesStore.universe.cluster)"
       />
    </template>
    <template v-slot:controls>
      <ClusterMapControlsPanel
          :cluster="universesStore.universe.cluster"
          @system-selected="systemSelected"
          @cluster-selected="clusterSelected"
          :plan="routePlannerService.getRoutePlanForCluster(universesStore.universe.cluster)"
      />
    </template>
  </Bezels>
</template>
