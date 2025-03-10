<script setup lang="ts">

import {useUniversesStore} from "~/stores/use-universes-store";
import {useUserScopeStore} from '~/stores/use-user-scope-store'
import type {RoutePlannerServiceInterface} from "~/types/RoutePlannerServiceTypes";
import type {SelectedSystemsListInterface, SelectedSystemsServiceInterface} from "~/types/SystemsSelectedListTypes";
import type {SystemModelInterface} from "~/types/SystemTypes";
import type {ClusterModelInterface} from "~/types/ClusterTypes";

const universesStore = useUniversesStore();
const { routePlannerService, selectedSystemsService } = useUserScopeStore() as { routePlannerService: RoutePlannerServiceInterface, selectedSystemsService: SelectedSystemsServiceInterface };

function systemSelected(system: SystemModelInterface) {
  if (universesStore.universe && universesStore.universe.cluster) {
    const selectedSystemsList = selectedSystemsService.getSelectedSystemsForCluster(universesStore.universe.cluster);
    if (selectedSystemsList) {
      selectedSystemsList.selectSystem(system);
      planTrip(selectedSystemsList);
    }
  }
}

function planTrip(selectedSystemsList : SelectedSystemsListInterface) {

  if (universesStore.universe && universesStore.universe.cluster) {
    if ( ! selectedSystemsList.maxSelected ) {
      routePlannerService.deleteRoutePlanForCluster(universesStore.universe.cluster);
      return;
    }
    const routePlan = routePlannerService.getRoutePlanForCluster(universesStore.universe.cluster);
    if ( ! routePlan) {
      return;
    }
    const [systemA, systemB] = selectedSystemsList.selectedSystems;
    if (! universesStore.universe.cluster) {
      throw new Error("No cluster created in ClusterMapControlsPanel.");
    }
    const routePlanner = createRoutePlanner(universesStore.universe.cluster);
    const routePlanRaw = routePlanner.plan(systemA, systemB);
    if (routePlanRaw) {
      routePlan.value = routePlanRaw;
    }
  }
}

function clusterSelected(newCluster: ClusterModelInterface) : void {
  if (universesStore.universe) {
    universesStore.universe.cluster = newCluster;
  }
}

</script>

<template>
  <Bezels>
    <template v-slot:display>
      <ClusterMapPanel
          v-if="universesStore.universe?.cluster"
          :cluster="universesStore.universe.cluster"
          @system-selected="systemSelected"
          :plan="routePlannerService.getRoutePlanForCluster(universesStore.universe.cluster)"
       />
    </template>
    <template v-slot:controls>
      <ClusterMapControlsPanel
          v-if="universesStore.universe?.cluster"
          :cluster="universesStore.universe?.cluster"
          @system-selected="systemSelected"
          @cluster-selected="clusterSelected"
          :plan="routePlannerService.getRoutePlanForCluster(universesStore.universe.cluster)"
      />
    </template>
  </Bezels>
</template>
