<script setup lang="ts">

import BezelLayout from "@/layouts/BezelLayout.vue"
import ClusterMapPanel from "@/components/ClusterMapPanel.vue";
import ClusterMapControlsPanel from "@/components/ClusterMapControlsPanel.vue";

import type {RoutePlanType} from "@/types/RoutePlannerTypes";
import {createRoutePlanner} from "@/utilities/RoutePlanner";
import type {ClusterModelInterface, ClustersModelInterface} from "@/types/ClusterTypes";
import {useClustersStore} from "@/stores/ClustersStore";
import {useUserScopeStore} from "@/stores/UserScopeStore";
import type {SelectedSystemsListInterface} from "@/types/SystemsSelectedListTypes";

const { clusters } = useClustersStore() as ClustersModelInterface;
const { selectedSystemsList, routePlan } = useUserScopeStore() as { selectedSystemsList: SelectedSystemsListInterface, routePlan: RoutePlanType };

console.log('ClusterMapView.setup() clusters: ', clusters);
console.log('ClusterMapView.setup() selectedSystemsList: ', selectedSystemsList);
console.log('ClusterMapView.setup() routePlan: ', routePlan);

function systemSelected(system: SystemModelInterface) {
  console.log('systemSelected() system: ', system);
  console.log('systemSelected() selectedSystemsList: ', selectedSystemsList);
  selectedSystemsList.selectSystem(system);
  console.log('ClusterMapView systemSelected() selectedSystemsList: ', selectedSystemsList);
  planTrip();
}

function clusterSelected(newCluster: ClusterModelInterface) : void {
  console.log('ClusterMapView.clusterSelected() 1 clusters: ', clusters);
  clusters.cluster = newCluster;
  console.log('ClusterMapView.clusterSelected() 2 clusters: ', clusters);
}

function planTrip() {
  console.log('ClusterMapView planTrip()')
  console.log('ClusterMapView planTrip() selectedSystems.value.maxSelected: ', selectedSystemsList.maxSelected);
  console.log('ClusterMapView planTrip() [...selectedSystemsList.getSelectedSystemsForCluster(clusters.value.cluster).values()]: ',
    [...selectedSystemsList.getSelectedSystemsForCluster(clusters.cluster).values()]
  );
  if ( ! selectedSystemsList.maxSelected ) {
    routePlan.value = undefined;
    return;
  }
  const [systemA, systemB] = [...selectedSystemsList.getSelectedSystemsForCluster(clusters.cluster).values()].map(value => value.system);
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
