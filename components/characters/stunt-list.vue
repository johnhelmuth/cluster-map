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
        <template v-if="stunt.mechanics?.length" >
          <p v-for="mechanicDescription in character.stuntMechanicsDescription(indx)" class="mechanic-description">{{
              mechanicDescription.description
            }}</p>
        </template>
      </li>
    </ul>
  </div>

</template>

<style scoped>

.stunt-item > * {
  grid-column: 1 / 3;
}

.stunt-item .mechanic-description {
  font-style: italic;
  text-align: right;
  font-size: .9rem;
}
</style>