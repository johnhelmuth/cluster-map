<script setup lang="ts">
import type {CharacterAspectData} from "~/types/character/CharacterTypes";

defineProps<{
  aspects?: Array<CharacterAspectData> | undefined
}>();

</script>

<template>
  <div v-if="aspects && aspects.length">
    <h3>Aspects</h3>
    <ul>
      <li v-for="aspect in aspects" class="aspect-item property-item">
        <div class="list-label aspect-type" v-if="aspect.aspectType">{{ aspect.aspectType }}:</div>
        <div class="list-label aspect-type" v-else>-</div>
        <div class="aspect-name value">{{ aspect.name }}</div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.aspect-item.property-item .aspect-name {
  font-weight: bold;
  font-style: italic;
  font-size: 1.1rem;
  padding-left: 1rem;
  text-indent: -1rem;
}
</style>