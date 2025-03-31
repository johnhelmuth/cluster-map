<script setup lang="ts">
import type {CharacterAspectData} from "~/types/character/CharacterTypes";

defineProps<{
  aspects?: Array<CharacterAspectData> | undefined
}>();

</script>

<template>
  <div v-if="aspects && aspects.length" class="aspect-list">
    <ul>
      <li v-for="(aspect, index) in aspects" class="aspect-item">
        <Aspect :aspect="aspect" track-id="character" class="scene-aspect" />
      </li>
    </ul>
  </div>
</template>

<style scoped>

div.aspect-list {
  padding: 0 1rem 1rem;
}
ul {
  list-style-type: none;
  padding-left: 0.5rem;
}
li.aspect-item {
  display: flex;
  padding-right: 1rem;
}
:deep(.scene-aspect) {
  margin-right: 0.5rem;
}
</style>