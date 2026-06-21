<script setup lang="ts">

import type {StuntData} from "~/types/character/CharacterTypes";
import type {CharacterModel} from "~/models/character/CharacterModel";

const props = defineProps<{
  "character": CharacterModel,
  "stunts": StuntData[],
}>();

</script>

<template>
  <div>
    <h3>Stunts</h3>
    <ul>
      <li v-for="(stunt, indx) in stunts" class="stunt-item property-item">
        <h4>{{ stunt.name }}</h4>
        <MDC v-if="stunt.description" :value="stunt.description" />
        <p v-if="character.stuntDiceExpression(indx)?.description">{{ character.stuntDiceExpression(indx)?.description}}</p>
      </li>
    </ul>
  </div>

</template>

<style scoped>

.stunt-item > * {
  grid-column: 1 / 3;
}
</style>