<script setup lang="ts">

import {useClustersStore} from "~/stores/use-clusters-store";
import {useUserScopeStore} from '~/stores/use-user-scope-store.ts'
import type {RoutePlannerServiceInterface} from "~/types/RoutePlannerServiceTypes";
import type {SelectedSystemsServiceInterface} from "~/types/SystemsSelectedListTypes";

const clustersStore = useClustersStore();
const { routePlannerService, selectedSystemsService } = useUserScopeStore() as { routePlannerService: RoutePlannerServiceInterface, selectedSystemsService: SelectedSystemsServiceInterface };

function systemSelected(system: SystemModelInterface) {
  if (clustersStore.clusters.cluster) {
    const selectedSystemsList = selectedSystemsService.getSelectedSystemsForCluster(clustersStore.clusters.cluster);
    if (selectedSystemsList) {
      selectedSystemsList.selectSystem(system);
      planTrip(selectedSystemsList);
    }
  }
}

function planTrip(selectedSystemsList : SelectedSystemsListInterface) {

  if (clustersStore.clusters.cluster) {
    if ( ! selectedSystemsList.maxSelected ) {
      routePlannerService.deleteRoutePlanForCluster(clustersStore.clusters.cluster);
      return;
    }
    const routePlan = routePlannerService.getRoutePlanForCluster(clustersStore.clusters.cluster);
    if ( ! routePlan) {
      return;
    }
    const [systemA, systemB] = selectedSystemsList.selectedSystems;
    if (! clustersStore.clusters.cluster) {
      throw new Error("No cluster created in ClusterMapControlsPanel.");
    }
    const routePlanner = createRoutePlanner(clustersStore.clusters.cluster);
    const routePlanRaw = routePlanner.plan(systemA, systemB);
    if (routePlanRaw) {
      routePlan.value = routePlanRaw;
    }
  }
}

function clusterSelected(newCluster: ClusterModelInterface) : void {
  clustersStore.clusters.cluster = newCluster;
}

</script>

<template>
  <Bezels>
    <template v-slot:display>
      <ClusterMapPanel
          v-if="clustersStore.clusters.cluster"
          :cluster="clustersStore.clusters.cluster"
          @system-selected="systemSelected"
          :plan="routePlannerService.getRoutePlanForCluster(clustersStore.clusters.cluster)"
       />
    </template>
    <template v-slot:controls>
      <ClusterMapControlsPanel
          :cluster="clustersStore.clusters.cluster"
          @system-selected="systemSelected"
          @cluster-selected="clusterSelected"
          :plan="routePlannerService.getRoutePlanForCluster(clustersStore.clusters.cluster)"
      />
    </template>
  </Bezels>
</template>
