<script setup lang="ts">

import {useTraitsOrdering} from "~/composables/use-traits-ordering";
import type {TraitData, TraitTypesKeys, TraitViewTypesKeys} from "~/types/character/CharacterTypes";
import {useCharactersStore} from "~/stores/use-characters-store";

const { getLadderLabel, formatTraitRank } = useCharactersStore();
const { sortTraits, getTraitsAsPyramid } = useTraitsOrdering();

const props = defineProps< {
  "traits": Array<TraitData>,
  "viewType": TraitViewTypesKeys
}>();


const sortedTraits = computed(() => {
  return sortTraits(props.traits, props.viewType);
});

const pyramidTraits = computed(() => {
  return getTraitsAsPyramid(props.traits);
});

</script>

<template>

  <ul>
    <template v-if="viewType !== 'pyramid'">
      <li v-for="trait in sortedTraits" class="trait-item property-item">
        <div class="list-label name">{{ trait.name }}:</div>
        <div class="rank value">{{ getLadderLabel(trait.rank, true) }} ({{
            formatTraitRank(trait.rank)
          }})
        </div>
      </li>
    </template>
    <template v-else>
      <li v-for="rankedTraits in pyramidTraits" class="trait-item property-item">
        <div class="list-label rank">{{ getLadderLabel(rankedTraits[0].rank, true) }} ({{
            formatTraitRank(rankedTraits[0].rank)
          }})
        </div>
        <div class="traits-ranked-row">
          <div v-for="trait in rankedTraits" class="name">{{ trait.name }}</div>
        </div>
      </li>
    </template>
  </ul>
</template>

<style scoped>
ul {
  list-style-type: none;
  padding-left: 0.5rem;
}
.trait-item {
  display: grid;
  grid-template-columns: 1fr 5fr;
  align-items: start;
  column-gap: 0.5rem;
  margin-bottom: 0.5rem;
}
.list-label {
  font-size: 1rem;
  text-align: right;
}
.traits-ranked-row {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: flex-start;
  gap: 0.25rem;
  font-size: 1rem;
}
.traits-ranked-row .name {
  font-weight: bold;
  width: 5rem;
}
</style>