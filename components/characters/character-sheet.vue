<script setup lang="ts">

import type {CharacterModel} from "~/models/character/CharacterModel";
import type {TraitViewTypesKeys} from "~/types/character/CharacterTypes";

const props = defineProps<{
  character?: CharacterModel,
  traitsViewType: TraitViewTypesKeys
}>();

function toggleBox(trackId: string, boxIndex: number): void {
  if (props.character) {
    props.character.toggleBox(trackId, boxIndex);
  } else {
    console.warn('CharacterSheet.toggleStressBox() Received toggle-stress action from StressConsequenceList with no character in scope.');
  }
}
function useTrackInvoke(trackId: string): void {
  if (props.character) {
    props.character.useTrackInvoke(trackId);
  }
}
function useCharacterAspectInvoke(aspectIndex: number): void {
  if (props.character) {
    props.character.useCharacterAspectInvoke(aspectIndex);
  }
}

</script>

<template>
  <div v-if="character" class="sheet">
    <IdentityList :name="character.name" :description="character.description" class="identity-list block first-three-columns"/>
    <RefreshList v-if="typeof character.refresh !== 'undefined' && typeof character.fatePoints !== 'undefined'" :refresh="character.refresh" :fatePoints="character.fatePoints" class="refresh-list block last-column" />
    <AspectList
        :aspects="character.aspects"
        v-if="character.aspects && character.aspects.length"
        class="block aspect-list left-half"
        @useInvoke="useCharacterAspectInvoke"
    />
    <TraitList
        v-if="character.traits.length"
        :traitType="character.traitType"
        :traits="character.traits"
        :view-type="traitsViewType"
        class="block trait-list right-half"
    />
    <TrackList
        v-if="character.tracks && character.tracks.length"
        :tracks="character.tracks"
        class="block track-list left-half"
        @toggleBox="toggleBox"
        @useInvoke="useTrackInvoke"
    />
    <StuntList
        v-if="character.stunts && character.stunts.length"
        :stunts="character.stunts"
        class="block stunt-list right-half"
    />
  </div>
  <div v-else>Loading...</div>
</template>

<style scoped>

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

@container (max-width: 1070px) {
  .left-half, .right-half {
    grid-column: 1 / -1;
  }
}

h3, :deep(h3) {
  text-align: left;
  text-indent: 3rem;
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
  container-type: inline-size;
}

.property-item, :deep(.property-item) {
  display: grid;
  grid-template-columns: 1fr 4fr;
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