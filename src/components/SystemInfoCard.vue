<script setup lang="ts">

  import type SystemModelInterface from "@/models/SystemModel";
  import SystemAttributes from "@/components/SystemAttributes.vue";
  import SystemAspects from "@/components/SystemAspects.vue";
  import type {SystemIdType} from "@/types/SystemTypes";
  import {computed} from "vue";
  import type {RoutePlanType} from "@/types/RoutePlannerTypes";

  const props = defineProps< {
    system: SystemModelInterface,
    plan?: RoutePlanType;
    systemInfoCardClosed?: boolean
  }>();

  defineEmits< {
    selected: [system: SystemModelInterface]
  } >();

  const isSelected = computed(() => props.system.getSelected());

  // TODO: Move these into a settings structure modifiable by the user.
  const attributesFormat="detailed";

</script>

<template>
  <div class="system-info-card accordion-control" :class="{ selected: isSelected }" @click="$emit('selected', system)">
    <h2>{{ system.name }}</h2>
    <div class="system-info accordion" :class="{ open: ! systemInfoCardClosed }">
      <SystemAttributes :attributes="system.attributes" :attributesFormat="attributesFormat"/>
      <SystemAspects :aspects="system.aspects" />
    </div>
  </div>
</template>

<style scoped>

h2 {
  font-size: 1.5rem;
}
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
  padding: 0.75rem;
}
.system-info-card.selected {
  box-shadow: inset -0.4rem -0.4rem 0.4rem grey,
              inset  0.4rem  0.4rem 0.4rem lightgrey;
  background-color: var(--color-background);
}


</style>
