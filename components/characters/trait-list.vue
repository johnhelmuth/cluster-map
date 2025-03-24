<script setup lang="ts">

import {useCharactersStore} from "~/stores/use-characters-store";
import type {TraitData, TraitTypesKeys} from "~/types/character/CharacterTypes";

const characters = useCharactersStore();

const props = defineProps<{
  "traitType": TraitTypesKeys,
  "traits": Array<TraitData>,
}>();
</script>

<template>
  <div>
    <h3>{{ characters.getTraitLabel(traitType || '', 'plural') }}</h3>
    <ul>
      <li v-for="trait in traits" class="trait-item property-item">
        <div class="list-label name">{{ trait.name }}:</div>
        <div class="rank value">{{ characters.getLadderLabel(trait.rank) }} ({{
            characters.formatTraitRank(trait.rank)
          }})
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>

</style>