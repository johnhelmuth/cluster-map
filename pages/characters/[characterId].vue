<script setup lang="ts">

import {useCharactersStore} from "~/stores/use-characters-store";

import {type TraitViewTypesKeys} from "~/types/character/CharacterTypes";

const route = useRoute();
const { getCharacter} = useCharactersStore();
const { userPreferences } = useUserPreferences();

onMounted(() => {
  // Add hide-not-to-be-printed class to body to trigger printing only the character sheet.
  if (document) {
    document.querySelector('body')?.classList.add('hide-not-to-be-printed');
  }
})
onBeforeUnmount(() => {
  // Remove hide-not-to-be-printed class on body so that other pages print the full page.
  if (document) {
    document.querySelector('body')?.classList.remove('hide-not-to-be-printed')
  }
})

const character = computed(() => {
  const characterId = route.params.characterId as string;
  return getCharacter(characterId);
});

const traitsViewType = ref('name' as TraitViewTypesKeys);

onMounted(() => {
  traitsViewType.value = userPreferences.characterSheet.traitViewStyle;
});

const page_title = computed(() => {
  return "Character - " + character.value?.name;
});


useSeoMeta({
  title: () => `Character` + (character.value?.name ? ` - ${character?.value.name}` : '')
})

function viewTypeChanged(viewType: TraitViewTypesKeys) {
  if (viewType) {
    traitsViewType.value = viewType;
  }
}

</script>

<template>
  <InfoPage :page_title="page_title">
    <CharacterSheet v-if="character"
                    :character="character"
                    :traits-view-type="traitsViewType"
                    @traitViewTypeChanged="viewTypeChanged"
    />
    <div v-else>Loading...</div>
  </InfoPage>
</template>

<style scoped>

</style>