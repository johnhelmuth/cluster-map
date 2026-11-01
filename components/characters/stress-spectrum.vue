<script setup lang="ts">
/*
   A spectrum track has aspects at either end representing what happens when the track is empty,
   and what happens when it is full.

   Usage:
            <StressSpectrum :track="track"
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

const ratioClass = computed(() => {
  if (props.track?.emptyAspect) {
    if (props.track.boxes.length > 0) {
      const usedCount = props.track.boxes.length ? props.track.boxes.reduce((total: number, b) => {
        return total + (b.isUsed ? 1 : 0);
      }, 0) : 0;
      const ratio = Math.trunc((usedCount / props.track.boxes.length) * 10) * 10;
      return `track-full-ratio-${ratio}`
    }
  }
})

</script>

<template>
  <div class="stress-spectrum">
    <div v-if="!! track?.emptyAspect" class="spectrum-label spectrum-empty-label" :class="ratioClass">
      {{ track.emptyAspect.name }}
    </div>
    <div class="spectrum-boxes">
      <StressBox
          v-for="index in track.boxes.length"
          :key="index-1"
          :soak-number="track.boxes[index-1]?.soakValue"
          :show-soak-amount="track.showSoakAmount"
          :is-checked="track.boxes[index-1]?.isUsed || false"
          @toggle-box="toggleBox(track.trackId, index-1)"
      />
    </div>
    <div v-if="!! track?.fullAspect" class="spectrum-label spectrum-full-label" :class="ratioClass">
      {{ track.fullAspect.name }}
    </div>
  </div>
</template>

<style scoped>

.stress-spectrum {
  display: grid;
  grid-template-columns: minmax(min-content,1fr) max-content minmax(min-content,2fr);
  justify-content: start;
  align-items: center;
  gap: .125rem;

  .spectrum-label {
    font-style: italic;
    flex: 1 auto;
  }
  .spectrum-empty-label {
    text-align: right;;
    margin-right: .5rem;
    font-size: 1rem;
    grid-column: 1 / 2;
  }

  .spectrum-full-label {
    text-align: left;
    margin-left: .5rem;
    font-size: 1rem;
    grid-column: -2 / -1;
  }

  .spectrum-empty-label.track-full-ratio-0 , .spectrum-full-label.track-full-ratio-100  {
    font-weight: bold;
    font-size: 1.3rem;
    color: rgb(from currentColor r g b / 100%);
  }

  .spectrum-empty-label.track-full-ratio-10, .spectrum-full-label.track-full-ratio-90  {
    font-size: 1.2rem;
    color: rgb(from currentColor r g b / 88%);
  }

  .spectrum-empty-label.track-full-ratio-20, .spectrum-full-label.track-full-ratio-80 {
    font-size: 1.1rem;
    color: rgb(from currentColor r g b / 76%);
  }

  .spectrum-empty-label.track-full-ratio-30, .spectrum-full-label.track-full-ratio-70  {
    font-size: 1rem;
    color: rgb(from currentColor r g b / 64%);
  }

  .spectrum-empty-label.track-full-ratio-40, .spectrum-full-label.track-full-ratio-60  {
    font-size: .9rem;
    color: rgb(from currentColor r g b / 52%);
  }

  .spectrum-empty-label.track-full-ratio-50, .spectrum-full-label.track-full-ratio-50  {
    font-size: .8rem;
    color: rgb(from currentColor r g b / 40%);
  }

  .spectrum-empty-label.track-full-ratio-60, .spectrum-full-label.track-full-ratio-40  {
    font-size: .7rem;
    color: rgb(from currentColor r g b / 28%);
  }

  .spectrum-empty-label.track-full-ratio-70, .spectrum-full-label.track-full-ratio-30  {
    font-size: .7rem;
    color: rgb(from currentColor r g b / 28%);
  }

  .spectrum-empty-label.track-full-ratio-80, .spectrum-full-label.track-full-ratio-20  {
    font-size: .7rem;
    color: rgb(from currentColor r g b / 28%);
  }

  .spectrum-empty-label.track-full-ratio-90, .spectrum-full-label.track-full-ratio-10  {
    font-size: .7rem;
    color: rgb(from currentColor r g b / 28%);
  }

  .spectrum-empty-label.track-full-ratio-100, .track-full-ratio-0.spectrum-full-label {
    font-size: .7rem;
    color: rgb(from currentColor r g b / 28%);
  }

  .spectrum-boxes {
    display: flex;
    flex-direction: row;
    column-gap: 0.125rem;

    &:deep(.stress-box-container) {
      --container-percent: 2.5;
      min-width: calc(var(--container-percent) * 1cqi);
      max-width: calc(var(--container-percent) * 1cqi);
      min-height: calc(var(--container-percent) * 1cqi);
      max-height: calc(var(--container-percent) * 1cqi);
    }
  }
}

</style>