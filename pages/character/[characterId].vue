<script setup lang="ts">

import {useCharactersStore} from "~/stores/use-characters-store";
import type {TraitViewTypesKeys} from "~/types/character/CharacterTypes";

const route = useRoute();
const characters = useCharactersStore();

const character = computed(() => {
  const characterId = route.params.characterId as string;
  return characters.getCharacter(characterId);
});

const traitsViewType = computed(() => {
  return "pyramid" as TraitViewTypesKeys;
});

const page_title = computed(() => {
  return "Character - " + character.value?.name;
});

useSeoMeta({
  title: () => `Character` + (character.value?.name ? ` - ${character?.value.name}` : '')
})

</script>

<template>
  <InfoPage :page_title="page_title">
    <CharacterSheet v-if="character"
                    :character="character"
                    :traits-view-type="traitsViewType"
    />
    <div v-else>Loading...</div>
  </InfoPage>
</template>

<style scoped>

</style>