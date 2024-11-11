<script setup lang="ts">

import {computed} from "vue";

import BezelLayout from "@/layouts/BezelLayout.vue"
import ClusterMapPanel from "@/components/ClusterMapPanel.vue";
import ClusterMapControlsPanel from "@/components/ClusterMapControlsPanel.vue";

import type {RoutePlanRefType, RoutePlanType} from "@/types/RoutePlannerTypes";
import {createRoutePlanner} from "@/utilities/RoutePlanner";
import type {ClusterModelInterface, ClustersModelInterface} from "@/types/ClusterTypes";
import {useClustersStore} from "@/stores/ClustersStore";
import {useUserScopeStore} from "@/stores/UserScopeStore";
import type {SelectedSystemsServiceInterface} from "@/types/SystemsSelectedListTypes";

const { clusters } = useClustersStore() as ClustersModelInterface;
const { routePlannerService, selectedSystemsService } = useUserScopeStore() as { routePlannerService: RoutePlannerServiceInterface, selectedSystemsService: SelectedSystemsServiceInterface };

console.log('ClusterMapView.setup() clusters: ', clusters);
console.log('ClusterMapView.setup() selectedSystemsService: ', selectedSystemsService);

const selectedSystemsList = computed(() => {
  return selectedSystemsService.getSelectedSystemsForCluster(clusters.cluster);
});

const routePlan = computed((): RoutePlanRefType => {
  return routePlannerService.getRoutePlanForCluster(clusters.cluster);
});
console.log('ClusterMapView.setup() routePlan: ', routePlan);

function systemSelected(system: SystemModelInterface) {
  console.log('systemSelected() system: ', system);
  console.log('systemSelected() selectedSystemsList.value: ', selectedSystemsList.value);
  selectedSystemsList.value.selectSystem(system);
  console.log('ClusterMapView systemSelected() selectedSystemsList.value: ', selectedSystemsList.value);
  planTrip();
}

function clusterSelected(newCluster: ClusterModelInterface) : void {
  console.log('ClusterMapView.clusterSelected() 1 clusters: ', clusters);
  clusters.cluster = newCluster;
  console.log('ClusterMapView.clusterSelected() 2 clusters: ', clusters);
}

function planTrip() {
  console.log('ClusterMapView planTrip()')
  console.log('ClusterMapView planTrip() selectedSystems.value.maxSelected: ', selectedSystemsList.value.maxSelected);
  console.log('ClusterMapView planTrip() [...selectedSystemsList.value.getSelectedSystemsForCluster(clusters.value.cluster).values()]: ',
    [...selectedSystemsList.value.getSelectedSystemsForCluster(clusters.cluster).values()]
  );

  if ( ! selectedSystemsList.value.maxSelected ) {
    routePlannerService.deleteRoutePlanForCluster(clusters.cluster);
    return;
  }
  const routePlan = routePlannerService.getRoutePlanForCluster(clusters.cluster);
  const [systemA, systemB] = [...selectedSystemsList.value.getSelectedSystemsForCluster(clusters.cluster).values()].map(value => value.system);
  console.log('planTrip() systemA: ', systemA);
  console.log('planTrip() systemB: ', systemB);
  if (! clusters.cluster) {
    throw new Error("No cluster created in ClusterMapControlsPanel.");
  }
  console.log('planTrip() clusters.cluster: ', clusters.cluster);
  const routePlanner = createRoutePlanner(clusters.cluster);
  routePlan.value = routePlanner.plan(systemA, systemB);
}

</script>

<template>
  <BezelLayout>
    <template v-slot:display>
      <ClusterMapPanel
        v-if="clusters.cluster"
        :cluster="clusters.cluster"
        @system-selected="systemSelected"
        :plan="routePlan"
      />
    </template>
    <template v-slot:controls>
      <ClusterMapControlsPanel
        :cluster="clusters.cluster"
        @system-selected="systemSelected"
        @cluster-selected="clusterSelected"
        :plan="routePlan"
      />
    </template>
  </BezelLayout>
</template>
