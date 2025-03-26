<script setup lang="ts">

import type {TrackData} from "~/types/character/CharacterTypes";

const props = defineProps<{
  track: TrackData;
}>();

const emit = defineEmits<{
  toggleStress: [trackId: string, index: number];
}>();

const showSoakAmount = computed(() => {
  return props.track.showSoakAmount;
});

function toggleBox(index: number) {
  emit('toggleStress', props.track.trackId, index);
}

</script>

<template>
  <div class="track">
  </div>
</template>

<style scoped>

</style>