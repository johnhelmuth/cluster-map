<script setup lang="ts">

import type {CharacterModel} from "~/models/character/CharacterModel";
import {AspectListMinimal} from "#components";
import {useCharactersStore} from "~/stores/use-characters-store";

const { getTraitLabel } = useCharactersStore();

const props = defineProps<{
  character?: CharacterModel
}>();

const aspectsContentElem = computed(() => {
  if (props?.character) {
    return `aspect-list-${props?.character?.id}`;
  }
});

function tabClicked(e: MouseEvent) {
  console.log('tabClicked() e: ', e);
  console.log('tabClicked() e.target: ', e.target);
  console.log('tabClicked() e.target.dataset: ', e.target.dataset);
  const contentId = e.target?.dataset?.contentId;
  console.log('tabClicked() contentId: ', contentId);
  const contentElement = document.getElementById(contentId);
  console.log('tabClicked() contentElement: ', contentElement);

}

</script>

<template>
<div v-if="character" class="character-card">
  <IdentityList :name="character.name"/>
  <div class="tabs">
    <div class="tab-container">
      <button class="tab" :data-content-id="aspectsContentElem" @click="tabClicked">Aspects</button>
      <AspectListMinimal :aspects="character.aspects" :id="aspectsContentElem" />
    </div>
    <div class="tab-container">
      <button class="tab">{{ getTraitLabel(character.traitType || '', 'plural') }}</button>
      <TraitListMinimal :traits="character.traits" :view-type="'pyramid'"/>
    </div>
  </div>
</div>
</template>

<style scoped>

.character-card {
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  background-color: var(--color-background);
  container-name: block;
  container-type: inline-size;

  box-shadow:
      inset -0.2rem -0.2rem 0.1rem var(--color-border),
      inset 0.2rem 0.2rem 0.1rem var(--color-background);
  /* filter: drop-shadow(.2rem .2rem .1rem grey); */
}


</style>