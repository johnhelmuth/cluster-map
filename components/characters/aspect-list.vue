<script setup lang="ts">
import type {CharacterAspectData} from "~/types/character/CharacterTypes";
import Aspect from "~/components/characters/aspect.vue";

defineProps<{
  aspects?: Array<CharacterAspectData> | undefined
}>();

const emit = defineEmits<{
  useInvoke: [aspectIndex: number]
}>();

function useInvoke(aspectIndex: number) {
  emit('useInvoke', aspectIndex);
}

</script>

<template>
  <div v-if="aspects && aspects.length">
    <h3>Aspects</h3>
    <ul>
      <li v-for="aspectIndex in aspects.length" class="aspect-item property-item">
        <div class="list-label aspect-type" v-if="aspects[aspectIndex]?.aspectType">
          {{ aspects[aspectIndex - 1]?.aspectType }}:
        </div>
        <div class="list-label aspect-type" v-else>-</div>
        <Aspect
            :aspect="aspects[aspectIndex-1]"
            :trackId="`characterAspects:${aspectIndex-1}`"
            @use-invoke="useInvoke(aspectIndex-1)"
            :class="{ 'aspect-name-spread': ! aspects[aspectIndex-1].freeInvokes }"
        />
      </li>
    </ul>
  </div>
</template>

<style scoped>

.aspect-item.property-item {
  grid-template-columns: 1fr 2fr 1fr;
}

:deep(.aspect-item.property-item .aspect-name) {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 1rem;
}

:deep(.aspect-item.property-item .aspect-name.aspect-name-spread) {
  grid-column: 2 / 4;
}

</style>