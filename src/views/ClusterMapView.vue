<script setup lang="ts">


import BezelLayout from "@/layouts/BezelLayout.vue"
import ClusterMapPanel from "@/components/ClusterMapPanel.vue";
import ClusterMapControlsPanel from "@/components/ClusterMapControlsPanel.vue";

import {createRoutePlanner} from "@/utilities/RoutePlanner";
import type {ClusterModelInterface, ClustersModelInterface} from "@/types/ClusterTypes";
import {useClustersStore} from "@/stores/ClustersStore";
import {useUserScopeStore} from "@/stores/UserScopeStore";
import type {SelectedSystemsListInterface, SelectedSystemsServiceInterface} from "@/types/SystemsSelectedListTypes";
import type {RoutePlannerServiceInterface} from "@/types/RoutePlannerServiceTypes";
import type {SystemModelInterface} from "@/types/SystemTypes";
import {useMapStyles} from "@/utilities/useMapStyles";
import {watch} from "vue";

const clustersStore = useClustersStore();
const { mapStyle } = useMapStyles();
const { routePlannerService, selectedSystemsService } = useUserScopeStore() as { routePlannerService: RoutePlannerServiceInterface, selectedSystemsService: SelectedSystemsServiceInterface };

watch([clustersStore.clusters, mapStyle], () => {
  clustersStore.clusters.cluster?.setMapViewParams(mapStyle.value)
});

function systemSelected(system: SystemModelInterface) {
  if (clustersStore.clusters.cluster) {
    const selectedSystemsList = selectedSystemsService.getSelectedSystemsForCluster(clustersStore.clusters.cluster);
    if (selectedSystemsList) {
      selectedSystemsList.selectSystem(system);
      planTrip(selectedSystemsList);
    }
  }
}

function clusterSelected(newCluster: ClusterModelInterface) : void {
  clustersStore.clusters.cluster = newCluster;
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

</script>

<template>
  <BezelLayout>
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
  </BezelLayout>
</template>
