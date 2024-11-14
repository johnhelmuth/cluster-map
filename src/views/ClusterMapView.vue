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

const { clusters } = useClustersStore();
const { routePlannerService, selectedSystemsService } = useUserScopeStore() as { routePlannerService: RoutePlannerServiceInterface, selectedSystemsService: SelectedSystemsServiceInterface };

console.log('ClusterMapView.setup() clusters: ', clusters);
console.log('ClusterMapView.setup() selectedSystemsService: ', selectedSystemsService);

function systemSelected(system: SystemModelInterface) {
  console.log('systemSelected() system: ', system);
  if (clusters.cluster) {
    const selectedSystemsList = selectedSystemsService.getSelectedSystemsForCluster(clusters.cluster);
    console.log('systemSelected() selectedSystemsList: ', selectedSystemsList);
    if (selectedSystemsList) {
      selectedSystemsList.selectSystem(system);
      console.log('ClusterMapView systemSelected() selectedSystemsList: ', selectedSystemsList);
      planTrip(selectedSystemsList);
    }
  }
}

function clusterSelected(newCluster: ClusterModelInterface) : void {
  console.log('ClusterMapView.clusterSelected() 1 clusters: ', clusters);
  clusters.cluster = newCluster;
  console.log('ClusterMapView.clusterSelected() 2 clusters: ', clusters);
}

function planTrip(selectedSystemsList : SelectedSystemsListInterface) {
  console.log('ClusterMapView planTrip()')
  console.log('ClusterMapView planTrip() selectedSystems.maxSelected: ', selectedSystemsList.maxSelected);
  console.log('ClusterMapView planTrip() selectedSystemsList.selectedSystems: ',selectedSystemsList.selectedSystems);

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
    console.log('planTrip() systemA: ', systemA);
    console.log('planTrip() systemB: ', systemB);
    if (! clusters.cluster) {
      throw new Error("No cluster created in ClusterMapControlsPanel.");
    }
    console.log('planTrip() clusters.cluster: ', clusters.cluster);
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
