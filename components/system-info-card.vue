<script setup lang="ts">

import type {SystemModelInterface} from "@/types/SystemTypes";

const props = defineProps<{
  system: SystemModelInterface | undefined,
  plan?: RoutePlanRefType,
  systemInfoCardClosed?: boolean
}>();

defineEmits< {
  selected: [system: SystemModelInterface | undefined]
} >();

const isSelected = computed(() => (props.system?.getSelected() || false));

// TODO: Move these into a settings structure modifiable by the user.
const attributesFormat="detailed";

</script>

<template>
  <div class="system-info-card accordion-control" :class="{ selected: isSelected }" @click="$emit('selected', system)">
    <h2>
      <span v-if="system?.url"><NuxtLink :to="system.url">{{ system?.name || 'Unknown' }}</NuxtLink></span>
      <span v-else>{{ system?.name || 'Unknown' }}</span>
    </h2>
    <div class="system-info accordion" :class="{ open: ! systemInfoCardClosed }">
      <SystemAttributes :attributes="system?.attributes || undefined" :attributesFormat="attributesFormat"/>
      <SystemAspects :aspects="system?.aspects || undefined" />
    </div>
  </div>
</template>

<style scoped>

.selected h2 {
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
