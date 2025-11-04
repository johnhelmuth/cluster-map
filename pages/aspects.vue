<script setup lang="ts">

import type {CharacterData} from "~/types/character/CharacterTypes";
import {useCharactersStore} from "~/stores/use-characters-store";

const charactersStore = useCharactersStore();

const showOnlyTypedCharacterAspects = ref(false);

const aspects = computed(() => {
  const aspectsList = [...charactersStore.characters.entries()].map(([id, character]) => {
    return character.aspects.map(aspect => {
      return {characterId: id, characterName: character.name, aspect}
    });
  }).flat();
  return aspectsList;
});

const filteredAspects = computed(() => {
  if (showOnlyTypedCharacterAspects.value) {
    return aspects.value.filter((aspectRow) => {
      return (aspectRow.aspect?.aspectType)
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
    <form name="filters">
      <label for="aspect-filter">
        Show only typed aspects
        <input id="aspect-filter" type="checkbox" v-model="showOnlyTypedCharacterAspects" />
      </label>
    </form>
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