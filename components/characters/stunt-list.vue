<script setup lang="ts">

import type {StuntData} from "~/types/character/CharacterTypes";

const props = defineProps<{
  "stunts": StuntData[]
}>();

</script>

<template>
  <div>
    <h3>Stunts</h3>
    <ul>
      <li v-for="stunt in stunts" class="stunt-item property-item">
        <h4>{{ stunt.name }}</h4>
        <p>{{ stunt.description }}</p>
      </li>
    </ul>
  </div>

</template>

<style scoped>

.stunt-item > * {
  grid-column: 1 / 3;
}
</style>