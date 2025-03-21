<script setup lang="ts">

import {useCharactersStore} from "~/stores/use-characters-store";

const route = useRoute();
const characters = useCharactersStore();

const character = computed(() => {
  const characterId = route.params.characterId as string;
  return characters.characters.has(characterId) && characters.characters.get(characterId);
});

const page_title = computed(() => {
  return "Character - " + character?.value.name;
});

useSeoMeta({
  title: () => `Character` + (character?.value?.name ? ` - ${character?.value.name}` : '')
})

</script>

<template>
  <InfoPage :page_title="page_title">
    <CharacterSheet :character="character" />
  </InfoPage>
</template>

<style scoped>

</style>