<script setup lang="ts">

import type {AspectData} from "~/types/character/CharacterTypes";

defineOptions({
  inheritAttrs: false
});

const props = defineProps<{
  trackId: string;
  aspect: AspectData
}>();

const emit = defineEmits<{
  useInvoke: [trackId: string]
}>();

function useInvoke(trackId: string) {
  emit('useInvoke', trackId);
}
</script>

<template>
  <div class="aspect-name value" :class="$attrs?.class">{{ aspect?.name || ' ' }}</div>
  <div v-if="aspect?.freeInvokes" class="aspect-invokes">
    <StressBox v-for="index in aspect.freeInvokes"
               class=""
               :key="index-1"
               :soak-number="1"
               :show-soak-amount="false"
               :is-checked="false"
               @toggle-box="useInvoke(trackId)"
    />
  </div>
</template>

<style scoped>
.aspect-name {
  font-weight: bold;
  font-style: italic;
  font-size: 1.1rem;
  padding-left: 1rem;
  text-indent: -1rem;
}
.aspect-invokes {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 0.35rem;
}
.aspect-invokes :deep(.stress-box-container) {
  width: 1rem;
  height: 1rem;
}
</style>