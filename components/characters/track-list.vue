<script setup lang="ts">
import type {TrackData} from "~/types/character/CharacterTypes";
import Track from "~/components/characters/track.vue";

const props = defineProps<{
  tracks: Array<TrackData>
}>();

const emit = defineEmits<{
  toggleBox: [trackId: string, index: number];
}>();

function toggleBox(trackId: string, stressIndex: number) {
  emit('toggleBox', trackId, stressIndex);
}

</script>

<template>
  <div>
    <h3>Stress and Consequences</h3>
    <ul class="track-list">
      <li v-for="track in tracks" class="track-item property-item">
        <div v-if="track.trackLabel" class="track-label list-label">{{ track.trackLabel }}</div>
        <div v-if="track.boxes.length" class="track-boxes">
          <StressBox
              v-for="index in track.boxes.length"
              :key="index-1"
              :soak-number="track.boxes[index-1].soakValue"
              :show-soak-amount="track.showSoakAmount"
              :is-checked="track.boxes[index-1].isUsed || false"
              @toggle-box="toggleBox(track.trackId, index-1)"
          />
        </div>
        <div class="track-aspect">
          {{ track?.aspect.name || ' ' }}
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.track-item.property-item {
  display: grid;
  grid-template-columns: 10rem minmax(1fr, max-content) auto;
}

.track-label {
  grid-column: 1 / 2;
}
.track-boxes {
  grid-column: 2 / 3;
}
.track-aspect {
  grid-column: 3 / 4;
}
</style>