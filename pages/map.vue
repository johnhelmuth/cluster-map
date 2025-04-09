<script setup lang="ts">

import {useUniversesStore} from "~/stores/use-universes-store";
import {useUserScopeStore} from '~/stores/use-user-scope-store'
import type {SystemModel} from "~/models/SystemModel";
import type {SelectedSystemsList} from "~/models/SelectedSystemsList";
import type {ClusterModel} from "~/models/ClusterModel";

const universesStore = useUniversesStore();
const { routePlannerService, selectedSystemsService } = useUserScopeStore() as { routePlannerService: RoutePlannerService, selectedSystemsService: SelectedSystemsService };

function systemSelected(system: SystemModel) {
  if (universesStore.universe && universesStore.universe.cluster) {
    const selectedSystemsList = selectedSystemsService.getSelectedSystemsForCluster(universesStore.universe.cluster);
    if (selectedSystemsList) {
      selectedSystemsList.selectSystem(system);
      planTrip(selectedSystemsList);
    }
  }
}

function planTrip(selectedSystemsList : SelectedSystemsList) {

  if (universesStore.universe && "cluster" in universesStore.universe) {
    if ( ! selectedSystemsList.maxSelected ) {
      // @ts-ignore
      routePlannerService.deleteRoutePlanForCluster(universesStore.universe.cluster);
      return;
    }
    // @ts-ignore
    const routePlan = routePlannerService.getRoutePlanForCluster(universesStore.universe.cluster);
    if ( ! routePlan) {
      return;
    }
    const [systemA, systemB] = selectedSystemsList.selectedSystems;
    if (! universesStore.universe.cluster) {
      throw new Error("No cluster created in ClusterMapControlsPanel.");
    }
    // @ts-ignore
    const routePlanner = createRoutePlanner(universesStore.universe.cluster);
    const routePlanRaw = routePlanner.plan(systemA, systemB);
    if (routePlanRaw) {
      routePlan.value = routePlanRaw;
    }
  }
}

function clusterSelected(newCluster: ClusterModel) : void {
  if (universesStore.universe) {
    universesStore.universe.cluster = newCluster;
  }
}

</script>

<template>
  <Bezels>
    <template v-slot:display v-if="universesStore.universe?.cluster">
      <ClusterMapPanel
          :cluster="universesStore.universe.cluster"
          @system-selected="systemSelected"
          :plan="routePlannerService.getRoutePlanForCluster(universesStore.universe.cluster)"
       />
    </template>
    <template v-slot:controls v-if="universesStore.universe?.cluster">
      <ClusterMapControlsPanel
          :cluster="universesStore.universe.cluster"
          @system-selected="systemSelected"
          @cluster-selected="clusterSelected"
          :plan="routePlannerService.getRoutePlanForCluster(universesStore.universe.cluster)"
      />
    </template>
  </Bezels>
</template>
