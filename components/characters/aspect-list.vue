<script setup lang="ts">
import type {CharacterAspectData} from "~/types/character/CharacterTypes";
import Aspect from "~/components/characters/aspect.vue";

defineProps<{
  aspects?: Array<CharacterAspectData> | undefined,
  hideHeader?: boolean
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
    <h3 v-if="! hideHeader">Aspects</h3>
    <ul>
      <li v-for="(aspect, aspectIndex) in aspects" class="aspect-item property-item">
        <div class="list-label aspect-type" v-if="aspect?.aspectType">
          {{ aspect.aspectType }}:
        </div>
        <div class="list-label aspect-type" v-else>-</div>
        <Aspect
            :aspect="aspect"
            :trackId="`characterAspects:${aspectIndex-1}`"
            @use-invoke="useInvoke(aspectIndex-1)"
            :class="{ 'aspect-name-spread': ! aspect.freeInvokes }"
        />
      </li>
    </ul>
  </div>
</template>

<style scoped>
ul {
  list-style-type: none;
  display: grid;
  grid-template-columns: 2fr 5fr;
  grid-column-gap: 1rem;
}

ul li {
  display: grid;
  grid-template-columns: subgrid;
  grid-column: 1 / -1;
  margin-bottom: 0.5rem;
}
ul li > :first-child {
  text-align: right;
}
ul li > :last-child {
  text-align: left;
}
</style>