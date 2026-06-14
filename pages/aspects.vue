<script setup lang="ts">

import type {CharacterData} from "~/types/character/CharacterTypes";
import {useCharactersStore} from "~/stores/use-characters-store";
import {useCharacterFilterParams} from "~/composables/use-character-filter-params";

const charactersStore = useCharactersStore();

const charFilterParams = useCharacterFilterParams();
const showOnlyTypedCharacterAspects = ref(false);

const aspects = computed(() => {
  const aspectsList = [...charactersStore.characters.entries()].map(([id, character]) => {
    if (charFilterParams.compareCharToFilter(character, charFilterParams.filters)) {
      return character.aspects.map(aspect => {
        return {characterId: id, characterName: character.name, aspect}
      });
    }
  }).filter(Boolean).flat();
  console.log('aspects() aspectsList: ', aspectsList);
  return aspectsList;
});

const filteredAspects = computed(() => {
  console.log('filteredAspects() showOnlyTypedCharacterAspects.value', showOnlyTypedCharacterAspects.value);
  if (showOnlyTypedCharacterAspects.value) {
    return aspects.value.filter((aspectRow) => {
      return (aspectRow && aspectRow.aspect?.aspectType)
    })
  }
  return [...aspects.value];
});

useSeoMeta({
  title: () => `Aspects`,
});

</script>

<template>
  <InfoPage page_title="Aspects">
    <CharacterFilterModal
        :params="charFilterParams.filterParams.value"
        @changed="charFilterParams.navigateToFilter"
    />
    <table>
      <caption><h2>Character Aspects</h2></caption>
      <tbody v-if="filteredAspects?.length">
        <tr v-for="aspectIndex in (filteredAspects.length || 0)" :key="aspectIndex">
          <td>
            <span v-if="aspectIndex === 1 || filteredAspects[aspectIndex-1].characterName != filteredAspects[aspectIndex-2].characterName">
              {{aspects[aspectIndex-1].characterName}}
            </span>
          </td>
          <td class="aspect-container"><Aspect :track-id="filteredAspects[aspectIndex-1].characterId" :aspect="filteredAspects[aspectIndex-1].aspect" /></td>
        </tr>
      </tbody>
    </table>
  </InfoPage>
</template>

<style scoped>
.aspect-container {
  display: flex;
  gap: 1rem;
}
</style>