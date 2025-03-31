<script setup lang="ts">

import {useCharactersStore} from "~/stores/use-characters-store";
import type {TraitData, TraitTypesKeys, TraitViewTypesKeys} from "~/types/character/CharacterTypes";
import {useTraitsOrdering} from "#imports";

const { getTraitLabel, getLadderLabel, formatTraitRank } = useCharactersStore();

const props = defineProps< {
  "traitType": TraitTypesKeys,
  "traits": Array<TraitData>,
  "viewType": TraitViewTypesKeys
}>();

const { sortTraits, getTraitsAsPyramid } = useTraitsOrdering();

/* @property sortedTraits {Array<TraitData>}
 *
 * Array of traits ordered by the name or the rank, depending on viewType. (Pyramid viewType is sorted by rank.)
 */
const sortedTraits = computed(() => {
  return sortTraits(props.traits, props.viewType);
});


/* @property pyramidTraits {{ Array<Array<TraitData>> }}
 *
 * Array of Arrays of traits, grouped and ordered by rank, used when viewType is Pyramid.
 *
 */
const pyramidTraits = computed(() => {
  return getTraitsAsPyramid(props.traits);
});

</script>

<template>
  <div>
    <h3>{{ getTraitLabel(traitType || '', 'plural') }}</h3>
    <ul>
      <template v-if="viewType !== 'pyramid'">
        <li v-for="trait in sortedTraits" class="trait-item property-item">
          <div class="list-label name">{{ trait.name }}:</div>
          <div class="rank value">{{ getLadderLabel(trait.rank) }} ({{
              formatTraitRank(trait.rank)
            }})
          </div>
        </li>
      </template>
      <template v-else>
        <li v-for="rankedTraits in pyramidTraits" class="trait-item property-item">
          <div class="list-label rank">{{ getLadderLabel(rankedTraits[0].rank) }} ({{
              formatTraitRank(rankedTraits[0].rank)
            }})
          </div>
          <div class="traits-ranked-row">
            <div v-for="trait in rankedTraits" class="name">{{ trait.name }}</div>
          </div>
        </li>
      </template>
    </ul>
  </div>
</template>

<style scoped>
.traits-ranked-row {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: flex-start;
  gap: 1rem;
}
.traits-ranked-row .name {
  font-weight: bold;
  width: 5rem;
}


</style>