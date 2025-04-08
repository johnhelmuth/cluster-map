<script setup lang="ts">

import {useClustersStore} from "~/stores/use-clusters-store";
import {useUserScopeStore} from '~/stores/use-user-scope-store'
import type {SystemModel} from "~/models/SystemModel";
import type {SelectedSystemsList} from "~/models/SelectedSystemsList";
import type {ClusterModel} from "~/models/ClusterModel";

const clustersStore = useClustersStore();
const { routePlannerService, selectedSystemsService } = useUserScopeStore() as { routePlannerService: RoutePlannerService, selectedSystemsService: SelectedSystemsService };

function systemSelected(system: SystemModel) {
  if (clustersStore.clusters.cluster) {
    const selectedSystemsList = selectedSystemsService.getSelectedSystemsForCluster(clustersStore.clusters.cluster);
    if (selectedSystemsList) {
      selectedSystemsList.selectSystem(system);
      planTrip(selectedSystemsList);
    }
  }
}

function planTrip(selectedSystemsList : SelectedSystemsList) {

  if ("cluster" in clustersStore.clusters) {
    if ( ! selectedSystemsList.maxSelected ) {
      // @ts-ignore
      routePlannerService.deleteRoutePlanForCluster(clustersStore.clusters.cluster);
      return;
    }
    // @ts-ignore
    const routePlan = routePlannerService.getRoutePlanForCluster(clustersStore.clusters.cluster);
    if ( ! routePlan) {
      return;
    }
    const [systemA, systemB] = selectedSystemsList.selectedSystems;
    if (! clustersStore.clusters.cluster) {
      throw new Error("No cluster created in ClusterMapControlsPanel.");
    }
    // @ts-ignore
    const routePlanner = createRoutePlanner(clustersStore.clusters.cluster);
    const routePlanRaw = routePlanner.plan(systemA, systemB);
    if (routePlanRaw) {
      routePlan.value = routePlanRaw;
    }
  }
}

function clusterSelected(newCluster: ClusterModel) : void {
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
          :plan="routePlannerService.getRoutePlanForCluster(clustersStore!.clusters!.cluster)"
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
