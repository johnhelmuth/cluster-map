<script setup lang="ts">

import BezelLayout from "@/layouts/BezelLayout.vue"
import ClusterMapPanel from "@/components/ClusterMapPanel.vue";
import ClusterMapControlsPanel from "@/components/ClusterMapControlsPanel.vue";

import {inject, reactive, ref} from 'vue'
import type {SystemIdType, SystemModelInterface} from "@/types/SystemTypes";
import type {RoutePlanType} from "@/types/RoutePlannerTypes";
import type {ClusterModelInterface} from "@/types/ClusterTypes";
import {createRoutePlanner} from "@/utilities/RoutePlanner";

const cluster: ClusterModelInterface | undefined = inject('cluster');

const routePlan = ref(undefined as RoutePlanType | undefined);
type SelectedSystemLogType = { seq: number, system: SystemModelInterface };

const selectedSystems = reactive(new Map<SystemIdType, SelectedSystemLogType>());
let selectedSequence = 0;

function systemSelected(system: SystemModelInterface) {
  system.toggleSelected();
  if (system.getSelected() && ! selectedSystems.has(system.id)) {
    if (selectedSystems.size > 1) {
      type LastSelectedRecord = { max: number, lastSystemSelected: SystemModelInterface | undefined };
      const initialLastSelectedRecord : LastSelectedRecord = { max: -1, lastSystemSelected: undefined };
      const { max, lastSystemSelected } = [...selectedSystems.values()].reduce(({max, lastSystemSelected }, {seq, system}: SelectedSystemLogType) => {
        if (seq > max) {
          return { max: seq, lastSystemSelected: system };
        }
        return { max, lastSystemSelected };
      }, initialLastSelectedRecord);
      if (max !== -1 && !! lastSystemSelected) {
        selectedSystems.delete(lastSystemSelected.id);
        lastSystemSelected.toggleSelected();
      }
    }
    selectedSequence++
    selectedSystems.set(system.id, { seq: selectedSequence, system });
  } else if (selectedSystems.has(system.id)) {
    selectedSystems.delete(system.id);
  }
  console.log('ClusterMapView systemSelected() selectedSystems: ', selectedSystems);
  planTrip();
}

function planTrip() {
  console.log('ClusterMapView planTrip()')
  console.log('ClusterMapView planTrip() selectedSystems.value.size: ', selectedSystems.size);
  if (selectedSystems.size !== 2) {
    routePlan.value = undefined;
    return;
  }
  const [systemA, systemB] = [...selectedSystems.values()].map(value => value.system);
  if (! cluster) {
    throw new Error("No cluster created in ClusterMapControlsPanel.");
  }
  const routePlanner = createRoutePlanner(cluster);
  routePlan.value = routePlanner.plan(systemA, systemB);
}

</script>

<template>
  <BezelLayout>
    <template v-slot:display>
      <ClusterMapPanel
        v-if="cluster"
        :cluster="cluster"
        :selected-systems="selectedSystems"
        @system-selected="systemSelected"
        :plan="routePlan"
      />
    </template>
    <template v-slot:controls>
      <ClusterMapControlsPanel
        :cluster="cluster"
        :selected-systems="selectedSystems"
        @system-selected="systemSelected"
        :plan="routePlan"
      />
    </template>
  </BezelLayout>
</template>
