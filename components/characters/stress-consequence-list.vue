<script setup lang="ts">
import type {TrackData} from "~/types/character/CharacterTypes";

const props = defineProps <{
  tracks: Array<TrackData>
}>();

const emit = defineEmits<{
  toggleStress: [trackId: string, index: number];
}>();

const stressTracks = computed(() => {
  return props.tracks ? props.tracks.filter((track) => track.trackType === 'stress') : [];
});

const consequenceTracks = computed(() => {
  return props.tracks ? props.tracks.filter((track) => track.trackType === 'consequence') : [];
});

function toggleStress(trackId: string, stressIndex: number) {
  console.log('StressConsequenceList.toggleStress() trackId, stressIndex: ', trackId, stressIndex);
  emit('toggleStress', trackId, stressIndex);
}

</script>

<template>
  <div>
    <h3>Stress and Consequences</h3>
    <template v-for="track in stressTracks">
      <ul>
        <li v-for="track in stressTracks" class="track-item property-item">
          <div v-if="track.trackLabel" class="track-label list-label">{{ track.trackLabel }}</div>
          <StressTrack v-if="track.stressParams"
                       :track-id="track.trackId"
                       :stress-params="track.stressParams"
                       @toggle-stress="toggleStress"
          />
        </li>
      </ul>
    </template>
  </div>

</template>

<style scoped>

</style>