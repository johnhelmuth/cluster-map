<script setup lang="ts">

import Bezel from "@/components/Bezel.vue"
import ClusterMapPanel from "@/components/ClusterMapPanel.vue";
import ClusterMapControlsPanel from "@/components/ClusterMapControlsPanel.vue";

import {computed, inject, reactive, ref} from 'vue'
import type {SystemModelInterface} from "@/types/SystemTypes";
import type {RoutePlanType} from "@/types/RoutePlannerTypes";
import type {ClusterModelInterface} from "@/types/ClusterTypes";

const cluster: ClusterModelInterface = inject('cluster');

const routePlan: RoutePlanType = ref(null);
const selectedSystems = reactive(new Map<SystemId, { seq: Number, system: SystemModelInterface }>());
let selectedSequence = 0;

console.log('selectedSystems: ', selectedSystems);
console.log('selectedSequence: ', selectedSequence);

function systemSelected(system: SystemModelInterface) {
  console.log('ClusterMapView systemSelected() system: ', system);
  if (system.getSelected() && ! selectedSystems.has(system.id)) {
    if (selectedSystems.size > 1) {
      const { max, lastSystemSelected } = [...selectedSystems.values()].reduce(({max, lastSystemSelected }, {seq, system}) => {
        if (seq > max) {
          return { max: seq, lastSystemSelected: system };
        }
        return { max, lastSystemSelected };
      }, { max: -1, lastSystemSelected: undefined });
      if (max !== -1) {
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
}

function routePlanned(plan: RoutePlanType) {
  routePlan.value = plan;
}

</script>

<template>
  <Bezel>
    <template v-slot:display>
      <ClusterMapPanel :cluster="cluster" :selected-systems="selectedSystems" :plan="routePlan"/>
    </template>
    <template v-slot:controls>
      <ClusterMapControlsPanel
        :cluster="cluster"
        :selected-systems="selectedSystems"
        @system-selected="systemSelected"
        :plan="routePlan"
        @route-planned="routePlanned"
      />
    </template>
  </Bezel>
</template>
