<script setup lang="ts">

import {useCharactersStore} from "~/stores/use-characters-store";
import AspectList from "~/components/characters/aspect-list.vue";
import StuntList from "~/components/characters/stunt-list.vue";
import IdentityList from "~/components/characters/identity-list.vue";
import type {CharacterModel} from "~/models/character/CharacterModel";

const props = defineProps<{
  character?: CharacterModel
}>();

function toggleStressBox(trackId: string, stressIndex: number): void {
  if (props.character) {
    props.character.toggleStressBox(trackId, stressIndex);
  } else {
    console.warn('CharacterSheet.toggleStressBox() Received toggle-stress action from StressConsequenceList with no character in scope.');
  }
}

</script>

<template>
  <div v-if="character" class="sheet">
    <IdentityList :name="character.name" :description="character.description" class="identity-list block first-three-columns"/>
    <RefreshList :refresh="character.refresh" :fatePoints="character.fatePoints" v-if="typeof character.refresh !== 'undefined' && typeof character.fatePoints !== 'undefined'" class="refresh-list block last-column" />
    <AspectList :aspects="character.aspects" v-if="character.aspects && character.aspects.length" class="block aspect-list left-half"/>
    <TraitList :traitType="character.traitType" :traits="character.traits"  v-if="character.traits.length" class="block trait-list right-half"/>
    <StuntList :stunts="character.stunts" v-if="character.stunts && character.stunts.length" class="block stunt-list all-columns"/>
    <StressConsequenceList :tracks="character.tracks" v-if="character.tracks && character.tracks.length" class="block track-list left-half" @toggleStress="toggleStressBox"/>
  </div>
  <div v-else>Loading...</div>
</template>

<style scoped>

h3, :deep(h3) {
  text-align: center;
}

h4, :deep(h4) {
  font-weight: bold;
  margin-bottom: 0.5rem;
}

ul, :deep(ul) {
  list-style-type: none;
}

.sheet {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 1rem;
}

.block {
  min-width: 10rem;
  container-name: block;
}

.all-columns {
  grid-column: 1 / 5;
}
.first-three-columns {
  grid-column: 1 / 4;
}
.last-column {
  grid-column: 4 / 5;
}
.left-half {
  grid-column: 1 / 3;
}
.right-half {
  grid-column: 3 / 5;
}

.property-item, :deep(.property-item) {
  display: grid;
  grid-template-columns: 1fr 2fr;
  align-items: start;
  column-gap: 0.5rem;
  margin-bottom: 0.5rem;
}

ul .list-label, :deep(ul .list-label) {
  text-align: right;
  font-size: 1rem;
}

.refresh-list .property-item {
  align-items: center;
}

.refresh-list ul .list-label {
  line-height: 1;
}

.refresh-list .value {
  font-size: 2rem;
}

.value, :deep(.value) {
  font-weight: bold;
}
</style>