<script setup lang="ts">
import type {TrackData} from "~/types/character/CharacterTypes";
import Track from "~/components/characters/track.vue";

const props = defineProps<{
  tracks: Array<TrackData>
}>();

const emit = defineEmits<{
  toggleBox: [trackId: string, index: number];
  useInvoke: [trackId: string]
}>();

function toggleBox(trackId: string, stressIndex: number) {
  emit('toggleBox', trackId, stressIndex);
}

function useInvoke(trackId: string) {
  emit('useInvoke', trackId);
}

// TODO: Implement consequence recovery state, track.aspect.state in 'free', 'used', 'recovering'

</script>

<template>
  <div class="track-list">
    <h3>Stress and Consequences</h3>
    <div class="track-value-list">
      <template v-for="track in tracks">
        <div v-if="track.trackLabel" class="track-label">{{ track.trackLabel }}</div>
        <div v-if="track.boxes.length" class="track-boxes" :class="{ 'track-boxes-spread': ! track?.aspect }">
          <StressBox
              v-for="index in track.boxes.length"
              :key="index-1"
              :soak-number="track.boxes[index-1].soakValue"
              :show-soak-amount="track.showSoakAmount"
              :is-checked="track.boxes[index-1].isUsed || false"
              @toggle-box="toggleBox(track.trackId, index-1)"
          />
        </div>
        <div v-if="track.aspect" class="track-aspect" :class="{'track-aspect-spread': ! track?.aspect?.freeInvokes}">
          {{ track?.aspect?.name || ' ' }}
        </div>
        <div v-if="track.aspect?.freeInvokes" class="track-aspect-invokes">
          <StressBox v-for="index in track.aspect.freeInvokes"
                     class=""
                     :key="index-1"
                     :soak-number="1"
                     :show-soak-amount="false"
                     :is-checked="false"
                     @toggle-box="useInvoke(track.trackId)"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>

.track-list .track-value-list {
  display: grid;
  grid-template-columns: 7rem minmax(1rem, max-content) 1fr 3rem;
  grid-row-gap: 1rem;
  grid-column-gap: 1rem;
}

.track-label {
  grid-column: 1 / 2;
  text-align: right;
  font-size: 1rem;
}

.track-boxes {
  grid-column: 2 / 3;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  gap: 0.75rem;
}

.track-boxes-spread {
  grid-column: 2 / 5;
}

.track-aspect {
  grid-column: 3 / 4;
  font-weight: bold;
  font-style: italic;
  font-size: 1.1rem;
  padding-left: 1rem;
  text-indent: -1rem;
}
.track-aspect.track-aspect-spread {
  grid-column: 3 / 5;
}
.track-aspect-invokes {
  grid-column: 4 / 5;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 0.35rem;
}
.track-aspect-invokes :deep(.stress-box-container) {
  width: 1rem;
  height: 1rem;
}
</style>
