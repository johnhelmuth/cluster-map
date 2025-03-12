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
  if (universesStore.universes.hasCurrentUniverse() && universesStore.universes.universe?.cluster) {
    const selectedSystemsList = selectedSystemsService.getSelectedSystemsForCluster(universesStore.universes.universe.cluster);
    if (selectedSystemsList) {
      selectedSystemsList.selectSystem(system);
      planTrip(selectedSystemsList);
    }
  }
}

function planTrip(selectedSystemsList : SelectedSystemsListInterface) {

  if (universesStore.hasUniverse() && universesStore.universes.universe?.cluster) {
    if ( ! selectedSystemsList.maxSelected ) {
      routePlannerService.deleteRoutePlanForCluster(universesStore.universes.universe.cluster);
      return;
    }
    const routePlan = routePlannerService.getRoutePlanForCluster(universesStore.universes.universe.cluster);
    if ( ! routePlan) {
      return;
    }
    const [systemA, systemB] = selectedSystemsList.selectedSystems;
    if (! universesStore.universes.universe.cluster) {
      throw new Error("No cluster created in ClusterMapControlsPanel.");
    }
    const routePlanner = createRoutePlanner(universesStore.universes.universe.cluster);
    const routePlanRaw = routePlanner.plan(systemA, systemB);
    if (routePlanRaw) {
      routePlan.value = routePlanRaw;
    }
  }
}

function clusterSelected(newCluster: ClusterModelInterface) : void {
  if (universesStore.hasUniverse() && universesStore.universes.universe?.cluster) {
    universesStore.universes.universe.cluster = newCluster;
  }
}

</script>

<template>
  <Bezels>
    <template v-slot:display>
      <ClusterMapPanel
          v-if="universesStore.hasUniverse() && universesStore.universes.universe?.cluster"
          :cluster="universesStore.universes.universe.cluster"
          @system-selected="systemSelected"
          :plan="routePlannerService.getRoutePlanForCluster(universesStore.universes.universe.cluster)"
       />
    </template>
    <template v-slot:controls>
      <ClusterMapControlsPanel
          v-if="universesStore.hasUniverse() && universesStore.universes.universe?.cluster"
          :cluster="universesStore.universes.universe.cluster"
          @system-selected="systemSelected"
          @cluster-selected="clusterSelected"
          :plan="routePlannerService.getRoutePlanForCluster(universesStore.universes.universe.cluster)"
      />
    </template>
  </Bezels>
</template>
