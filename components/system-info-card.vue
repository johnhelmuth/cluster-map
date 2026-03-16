<script setup lang="ts">

import type {SystemModelInterface} from "@/types/SystemTypes";
import {useUserScopeStore} from "~/stores/use-user-scope-store";

const props = defineProps<{
  system: SystemModelInterface | undefined,
  systemInfoCardClosed?: boolean
}>();

defineEmits< {
  selected: [system: SystemModelInterface | undefined]
} >();


const {routePlannerService} = useUserScopeStore();

const isSelected = computed(() => (props.system && routePlannerService.selectedSystemsList.systemIsSelected(props.system) || false));

// TODO: Move these into a settings structure modifiable by the user.
const attributesFormat="detailed";

</script>

<template>
  <div class="system-info-card accordion-control" :class="{ selected: isSelected }" @click="$emit('selected', system)">
    <h3>
      <span v-if="system?.url"><NuxtLink :to="system.url">{{ system?.name || 'Unknown' }}</NuxtLink></span>
      <span v-else>{{ system?.name || 'Unknown' }}</span>
    </h3>
    <div class="system-info accordion" :class="{ open: ! systemInfoCardClosed }">
      <SystemAttributes :attributes="system?.attributes || undefined" :attributesFormat="attributesFormat"/>
      <SystemAspects :aspects="system?.aspects || undefined" />
    </div>
  </div>
</template>

<style scoped>

h3 {
  font-size: 1.25rem;
}

.selected h3 {
  font-weight: bold;
}

.accordion {
  display: none;
}

.accordion.open {
  display: block;
}

.system-info-card {
  border-radius: 5px;
  background-color: var(--color-background-mute);
  box-shadow: inset  0.2rem  0.2rem 0.2rem grey,
  inset -0.2rem -0.2rem 0.2rem lightgrey;
  margin: 0.5rem 0;
  padding: 0.25rem 0.5rem;
}
.system-info-card.selected {
  box-shadow: inset -0.4rem -0.4rem 0.4rem grey,
  inset  0.4rem  0.4rem 0.4rem lightgrey;
  background-color: var(--color-background);
}

</style>
