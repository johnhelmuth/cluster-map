<script setup lang="ts">
import type {TrackData} from "~/types/character/CharacterTypes";
import {useCharactersStore} from "~/stores/use-characters-store";

const { getCharacter } = await useCharactersStore();

const props = defineProps<{
  tracks: Array<TrackData>
  title?: string;
}>();

const emit = defineEmits<{
  toggleBox: [trackId: string, index: number];
  useInvoke: [trackId: string]
}>();

const titleString = computed(() => {
  if (typeof props.title !== 'undefined') {
    return props.title;
  }
  return 'Stress and Consequences';
})

function trackBoxClasses(track: TrackData) {
  return {
    'track-boxes-spread': !track?.aspect,
    'spectrum-track': !!track?.emptyAspect
  } as {
    'track-boxes-spread': boolean,
    'spectrum-track': boolean
  };
}

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
    <h3 v-if="titleString">{{ titleString }}</h3>
    <div class="track-value-list">
      <div v-for="track in tracks" :key="track.trackId" class="track-container" :class="trackBoxClasses(track)">
        <div v-if="track.trackLabel" class="track-label">
          <template v-if="track.characterReference && getCharacter(track.characterReference)">
            <NuxtLink :to="getCharacter(track.characterReference)?.toLink()">{{ track.trackLabel }}</NuxtLink>
          </template>
          <template v-else>{{ track.trackLabel }}</template>
        </div>
        <div v-if="track.boxes.length" class="track-boxes">
          <StressList v-if="! track.emptyAspect"
                      :track="track"
                      @toggle-box="toggleBox"
          />
          <StressSpectrum v-else
                          :track="track"
                          @toggle-box="toggleBox"
          />
        </div>
        <Aspect
            v-if="track.aspect"
            :track-id="track.trackId"
            :aspect="track.aspect"
            class="track-aspect"
            @use-invoke="useInvoke(track.trackId)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>

.track-list {

  .track-value-list {
    display: grid;
    grid-template-columns: minmax(5rem, min-content) min-content 1fr;
    grid-row-gap: 1rem;
    grid-column-gap: .5rem;

    /* TODO: make sure none of these conflict... e.g. spectrum tracks should not have an aspect like a consequence. */

    .track-container {
      grid-column: 1 / -1;
      display: grid;
      grid-template-columns: subgrid;
      grid-template-areas: "label boxes aspect";
      align-items: center;

      &.track-boxes-spread, &.spectrum-track {
        grid-template-areas: "label boxes boxes";
      }

      .track-label {
        grid-area: label;
        text-align: right;
        font-size: 1rem;
      }

      .track-label:has(+ .spectrum-track) {
        font-weight: bold;
      }

      .track-boxes {
        grid-area: boxes;
      }

      *:has(.track-aspect) {
        grid-area: aspect;
        font-weight: bold;
        font-style: italic;
        font-size: 1.1rem;
      }
    }
  }

}

</style>
