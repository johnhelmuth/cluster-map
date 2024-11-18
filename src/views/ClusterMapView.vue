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

const { clusters } = useClustersStore();
const { mapStyle, clusterOrientation } = useMapStyles();
const { routePlannerService, selectedSystemsService } = useUserScopeStore() as { routePlannerService: RoutePlannerServiceInterface, selectedSystemsService: SelectedSystemsServiceInterface };

watch([clusters, mapStyle, clusterOrientation], () => {
  clusters.cluster?.setMapViewParams(mapStyle.value, clusterOrientation.value)
});

function systemSelected(system: SystemModelInterface) {
  if (clusters.cluster) {
    const selectedSystemsList = selectedSystemsService.getSelectedSystemsForCluster(clusters.cluster);
    if (selectedSystemsList) {
      selectedSystemsList.selectSystem(system);
      planTrip(selectedSystemsList);
    }
  }
}

function clusterSelected(newCluster: ClusterModelInterface) : void {
  clusters.cluster = newCluster;
}

function planTrip(selectedSystemsList : SelectedSystemsListInterface) {

  if (clusters.cluster) {
    if ( ! selectedSystemsList.maxSelected ) {
      routePlannerService.deleteRoutePlanForCluster(clusters.cluster);
      return;
    }
    const routePlan = routePlannerService.getRoutePlanForCluster(clusters.cluster);
    if ( ! routePlan) {
      return;
    }
    const [systemA, systemB] = selectedSystemsList.selectedSystems;
    if (! clusters.cluster) {
      throw new Error("No cluster created in ClusterMapControlsPanel.");
    }
    const routePlanner = createRoutePlanner(clusters.cluster);
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
        v-if="clusters.cluster"
        :cluster="clusters.cluster"
        @system-selected="systemSelected"
        :plan="routePlannerService.getRoutePlanForCluster(clusters.cluster)"
      />
    </template>
    <template v-slot:controls>
      <ClusterMapControlsPanel
        :cluster="clusters.cluster"
        @system-selected="systemSelected"
        @cluster-selected="clusterSelected"
        :plan="routePlannerService.getRoutePlanForCluster(clusters.cluster)"
      />
    </template>
  </BezelLayout>
</template>
