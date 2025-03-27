<script setup lang="ts">

import {useCharactersStore} from "~/stores/use-characters-store";
import type {TraitData, TraitTypesKeys, TraitViewTypesKeys} from "~/types/character/CharacterTypes";

const characters = useCharactersStore();

const props = defineProps< {
  "traitType": TraitTypesKeys,
  "traits": Array<TraitData>,
  "viewType": TraitViewTypesKeys
}>();

function traitCompareFunction(viewType: TraitViewTypesKeys) {
  return function (a: TraitData, b: TraitData): number {
    let a_val, b_val;
    switch (viewType) {
      case 'rank':
      case 'pyramid':
        // Swap to get descending order.
        a_val = b.rank; b_val = a.rank;
        break;
      case 'name':
      default:
        a_val = a.name; b_val = b.name;
        break;
    }
    if (a_val < b_val) {
      return -1;
    } else if (a_val > b_val) {
      return 1;
    }
    return 0;
  }
}

function sortTraits(traits: Array<TraitData>, viewType: TraitViewTypesKeys) {
  return traits.sort(traitCompareFunction(viewType));
}

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
  let currentRankArray : Array<TraitData> = [];
  let currentRank: number = Infinity;
  const pyramidTraitArray: Array<Array<TraitData>> = [];
  for (const trait of sortedTraits.value) {
    if (currentRank === Infinity) {
      currentRank = trait.rank;
    }
    if (currentRank != trait.rank) {
      pyramidTraitArray.push([...sortTraits(currentRankArray, 'name')]); // Make copy
      currentRankArray = [];
    }
    currentRank = trait.rank;
    currentRankArray.push(trait);
  }
  pyramidTraitArray.push([...sortTraits(currentRankArray, 'name')]); // Make copy
  return pyramidTraitArray;
});

</script>

<template>
  <div>
    <h3>{{ characters.getTraitLabel(traitType || '', 'plural') }}</h3>
    <ul>
      <template v-if="viewType !== 'pyramid'">
        <li v-for="trait in sortedTraits" class="trait-item property-item">
          <div class="list-label name">{{ trait.name }}:</div>
          <div class="rank value">{{ characters.getLadderLabel(trait.rank) }} ({{
              characters.formatTraitRank(trait.rank)
            }})
          </div>
        </li>
      </template>
      <template v-else>
        <li v-for="rankedTraits in pyramidTraits" class="trait-item property-item">
          <div class="list-label rank">{{ characters.getLadderLabel(rankedTraits[0].rank) }} ({{
              characters.formatTraitRank(rankedTraits[0].rank)
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