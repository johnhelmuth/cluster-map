<script setup lang="ts">

import {useCharactersStore} from "~/stores/use-characters-store";
import {
  type TraitData,
  type TraitTypesKeys,
  TraitViewTypes,
  type TraitViewTypesKeys
} from "~/types/character/CharacterTypes";

const { getTraitLabel, getLadderLabel, formatTraitRank } = useCharactersStore();

const props = defineProps<{
  "traitType": TraitTypesKeys,
  "traits": Array<TraitData>,
  "viewType": TraitViewTypesKeys
}>();

const emit = defineEmits<{
  traitViewTypeChanged: [viewType: TraitViewTypesKeys]
}>();

function traitCompareFunction(viewType: TraitViewTypesKeys) {
  return function (a: TraitData, b: TraitData): number {
    let a_val, b_val;
    switch (viewType) {
      case 'rank':
      case 'pyramid':
        // Swap to get descending order.
        a_val = b.rank;
        b_val = a.rank;
        break;
      case 'name':
      default:
        a_val = a.name;
        b_val = b.name;
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

type PyramidRankTraitsData = {
  rank: number,
  slotCount: number,
  traits: Array<Partial<TraitData>>
};

/* @property pyramidTraits {{ Map<number, PyramidRankTraitsData> }}
 *
 * Map of traits, keyed by rank, used when viewType is Pyramid.
 *
 */
const pyramidTraits = computed(() => {
  if (typeof props.traits !== "undefined") {
    const maxRank = props.traits?.reduce((max, trait) => {
      return Math.max(trait.rank, max);
    }, Number.MIN_SAFE_INTEGER);

    const minRank = props.traits?.reduce((min, trait) => {
      return Math.min(trait.rank, min);
    }, Number.MAX_SAFE_INTEGER);

    const rankedTraits = new Map<number, PyramidRankTraitsData>();
    // Set up pyramid in the map with each entry for the rank, with empty arrays for the traits.
    for (let rank = maxRank; rank >= Math.min(1, minRank); rank--) {
      const traits = [] as Partial<TraitData>[];
      const slotCount = maxRank - rank + 1;
      rankedTraits.set(rank, {rank, slotCount, traits})
    }
    // Add in the current character's traits, for each rank.
    for (const trait of sortedTraits.value) {
      if (minRank <= trait.rank && trait.rank <= maxRank) {
        let pyramidRankTraitsData = rankedTraits.get(trait.rank);
        if (pyramidRankTraitsData) {
          pyramidRankTraitsData.traits.push(trait);
        }
      }
    }
    // Add in each row of the pyramid with empty trait data for the number of slots for that row.
    for (const [rank, rankTraitsData] of rankedTraits) {
      if (rankTraitsData.traits.length < rankTraitsData.slotCount) {
        // Fill in the trait slots for each row up to the slot count, with empty names.
        for (let i = rankTraitsData.traits.length; i < rankTraitsData.slotCount; i++) {
          rankTraitsData.traits.push({rank})
        }
      }
    }
    return rankedTraits;
  }

});

const pyrMaxSlots = computed(() => {
  let max = 0;
  pyramidTraits.value?.forEach((traitsData) => {
    max = Math.max(max, traitsData.slotCount)
  })
  return max;
})

const traitLabel = computed(() => getTraitLabel(props.traitType || '', 'plural'));

function TraitViewTypeChanged(e: Event) {
  console.log('viewTypeChanged() e.target', e.target);
  if (e.target) {
    const target = e.target as HTMLSelectElement;
    emit('traitViewTypeChanged', target.value as TraitViewTypesKeys);
  }
  return false;
}
</script>

<template>
  <div>
    <h3>{{ traitLabel }}</h3>
    <select @change="TraitViewTypeChanged" :aria-label="`${traitLabel} trait list format type`">
      <option
          v-for="(label, value) in TraitViewTypes"
          :value="value"
          :selected="value === viewType"
      >{{ label }}</option>
    </select>
    <ul :class="{[`viewtype-${viewType}`]: true, [`max-slots-${pyrMaxSlots}`]: viewType === 'pyramid'}">
      <template v-if="viewType !== 'pyramid'">
        <li v-for="trait in sortedTraits" class="trait-item property-item">
          <div class="rank list-label">{{ getLadderLabel(trait.rank) }} ({{
              formatTraitRank(trait.rank)
            }}):
          </div>
          <div class="value name">{{ trait.name }}</div>
        </li>
      </template>
      <template v-else>
        <li v-for="[rank, pyrTraitData] in pyramidTraits" class="trait-item property-item"
            :class="`slots-${pyrTraitData.traits.length}`">
          <div class="list-label rank">{{ getLadderLabel(rank) }} ({{
              formatTraitRank(rank)
            }})
          </div>
          <div class="traits-ranked-row">
            <template v-for="trait in pyrTraitData.traits">
              <div v-if="! trait.name" class="name is-empty">&nbsp;</div>
              <div v-else class="name">{{ trait.name }}</div>
            </template>
          </div>
        </li>
      </template>
    </ul>
  </div>
</template>

<style scoped>

div.trait-list {
  display: grid;
  grid-template-columns: 4fr 1fr;
  grid-auto-rows: min-content;
}
div.trait-list h3 {
  grid-column: 1 / 2
}
div.trait-list select {
  grid-column: 2 / -1;
  height: 1.2rem;
  width: 5rem;
  text-align: center;
  justify-self: right;
}
div.trait-list ul {
  width: 100%;
  grid-column: 1 / -1;
  padding-left: 0;
}
ul.viewtype-pyramid {
  display: grid;
  grid-template-columns: max-content max-content;
  grid-auto-rows: min-content;
}

ul.viewtype-pyramid li.trait-item {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: subgrid;
}

ul.viewtype-pyramid li.trait-item div.rank {
  grid-column: 1 / 2;
  font-size: inherit;
}

ul.viewtype-pyramid li.trait-item .traits-ranked-row {
  grid-column: 2 / -1;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: flex-start;
  gap: 1rem;
}

.traits-ranked-row .name {
  font-weight: bold;
  width: 5em;
  margin-left: .5rem;
}

.traits-ranked-row .name.is-empty {
  border-bottom: 1px solid var(--color-border);
  border-bottom: 1px solid black;
}

@container (width < 38rem) {
  ul.viewtype-pyramid {
    grid-template-columns: max-content;
    grid-auto-rows: min-content;
  }
  ul.viewtype-pyramid li.trait-item div.rank {
    grid-column: 1 / -1;
    text-align: left;
  }
  ul.viewtype-pyramid li.trait-item .traits-ranked-row {
    grid-column: 1 / -1;
    margin-left: 1.5rem;
    margin-top: 0.25rem;
  }
}

/**
 * This container size only shows up in a narrow single column window, the pyramid needs to shrink here.
 */
@container (width < 33rem) {
  ul.viewtype-pyramid li.trait-item {
    font-size: 0.8rem;
  }
}



</style>