<script setup lang="ts">
/*
 Usage:
  <StressList :track="track"
              @toggle-box="toggleBox(track.trackId, index-1)"
  />
 */
import type {TrackData} from "~/types/character/CharacterTypes";

const props = defineProps<{
  track: TrackData;
}>();

const emit = defineEmits<{
  toggleBox: [trackId: string, index: number];
}>();

function toggleBox(trackId: string, stressIndex: number) {
  emit('toggleBox', trackId, stressIndex);
}

</script>

<template>
  <div class="stress-list">
  <StressBox
      v-for="index in track.boxes.length"
      :key="index-1"
      :soak-number="track.boxes[index-1]?.soakValue"
      :show-soak-amount="track.showSoakAmount"
      :is-checked="track.boxes[index-1]?.isUsed || false"
      @toggle-box="toggleBox(track.trackId, index-1)"
  />
  </div>
</template>

<style scoped>

.stress-list {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  gap: 0.75rem;
}
</style>