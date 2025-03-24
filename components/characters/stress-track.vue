<script setup lang="ts">
import type {StressParamsData} from "~/types/character/CharacterTypes";

const props = defineProps<{
  trackId: string;
  stressParams: StressParamsData
}>();

const emit = defineEmits<{
  toggleStress: [trackId: string, index: number];
}>();

const showSoakAmount = computed(() => {
  return props.stressParams.stressSoakType === "increasing";
});

function toggleBox(index: number) {
  console.log('StressTrack toggleBox() trackId', props.trackId);
  console.log('StressTrack toggleBox() index', index);
  emit('toggleStress', props.trackId, index);
}

</script>

<template>
  <div class="stress-track">
    <template v-for="index in stressParams.numBoxes" :key="index-1">
      <StressBox
                 :soak-number="showSoakAmount ? index : 1"
                 :show-soak-amount="showSoakAmount"
                 :is-checked="stressParams.isUsed?.[index-1] || false"
                 :box-limit-per-action="stressParams.stressBoxLimitPerAction"
                 @toggle-box="toggleBox(index-1)"
      />
    </template>
  </div>
</template>

<style scoped>
.stress-track {
  display: flex;
  flex-direction: row;
  column-gap: 0.5rem;
}
</style>