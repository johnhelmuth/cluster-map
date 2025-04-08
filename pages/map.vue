<script setup lang="ts">

import {useUniverseStore} from "~/stores/use-universe-store";
import {useUserScopeStore} from '~/stores/use-user-scope-store'
import type {SystemModel} from "~/models/SystemModel";
import type {SelectedSystemsList} from "~/models/SelectedSystemsList";
import type {ClusterModel} from "~/models/ClusterModel";

const universeStore = useUniverseStore();
const { routePlannerService, selectedSystemsService } = useUserScopeStore() as { routePlannerService: RoutePlannerService, selectedSystemsService: SelectedSystemsService };

function systemSelected(system: SystemModel) {
  if (universeStore.clusters.cluster) {
    const selectedSystemsList = selectedSystemsService.getSelectedSystemsForCluster(universeStore.clusters.cluster);
    if (selectedSystemsList) {
      selectedSystemsList.selectSystem(system);
      planTrip(selectedSystemsList);
    }
  }
}

function planTrip(selectedSystemsList : SelectedSystemsList) {

  if ("cluster" in universeStore.clusters) {
    if ( ! selectedSystemsList.maxSelected ) {
      // @ts-ignore
      routePlannerService.deleteRoutePlanForCluster(universeStore.clusters.cluster);
      return;
    }
    // @ts-ignore
    const routePlan = routePlannerService.getRoutePlanForCluster(universeStore.clusters.cluster);
    if ( ! routePlan) {
      return;
    }
    const [systemA, systemB] = selectedSystemsList.selectedSystems;
    if (! universeStore.clusters.cluster) {
      throw new Error("No cluster created in ClusterMapControlsPanel.");
    }
    // @ts-ignore
    const routePlanner = createRoutePlanner(universeStore.clusters.cluster);
    const routePlanRaw = routePlanner.plan(systemA, systemB);
    if (routePlanRaw) {
      routePlan.value = routePlanRaw;
    }
  }
}

function clusterSelected(newCluster: ClusterModel) : void {
  universeStore.clusters.cluster = newCluster;
}

</script>

<template>
  <Bezels>
    <template v-slot:display>
      <ClusterMapPanel
          v-if="universeStore.clusters.cluster"
          :cluster="universeStore.clusters.cluster"
          @system-selected="systemSelected"
          :plan="routePlannerService.getRoutePlanForCluster(universeStore!.clusters!.cluster)"
       />
    </template>
    <template v-slot:controls>
      <ClusterMapControlsPanel
          :cluster="universeStore.clusters.cluster"
          @system-selected="systemSelected"
          @cluster-selected="clusterSelected"
          :plan="routePlannerService.getRoutePlanForCluster(universeStore.clusters.cluster)"
      />
    </template>
  </Bezels>
</template>
