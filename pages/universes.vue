<script setup lang="ts">

import {useUniversesStore} from "~/stores/use-universes-store";
import type {UniverseMetadataData, UniverseMetadataDataStatus} from "~/models/UniversesManager";

const universesStore = useUniversesStore();

function universeRowClass(universeMetadata: UniverseMetadataDataStatus) {
  return {
    selected: universesStore.currentUniverseId === universeMetadata.id,
    loaded: universeMetadata.isLoaded,
  };
}

async function selectUniverse(evt: Event) {
  const target = evt.target as HTMLElement;
  if (target.dataset.universeId !== undefined) {
    const universeId = target.dataset.universeId;
    await universesStore.setCurrentUniverseId(universeId);
  }
}

function debug() {
  console.log('universesStore.universe?.name: ', universesStore.universe?.name);
}

</script>

<template>
  <InfoPage page_title="Universes">
    <div>Click on a row to select that universe.  <button @click="debug" id="debug">Debug</button></div>

    <div v-if="universesStore.universesMetadata.length" class="universes-list">
      <span class="column-label">ID</span><span class="column-label">Name</span>
      <template v-for="(universeMetadata, index) in universesStore.universesMetadata" :key="index">
        <span
            :data-universe-id="universeMetadata.id"
            @click="selectUniverse"
            :class="universeRowClass(universeMetadata)"
            class="universe-id"
        >
          {{ universeMetadata.id }}
        </span>
        <span
            :data-universe-id="universeMetadata.id"
            @click="selectUniverse"
            :class="universeRowClass(universeMetadata)"
            class="universe-name"
        >
          {{ universeMetadata.name }}
        </span>
      </template>
    </div>
  </InfoPage>
</template>

<style scoped>

.universes-list{
  width: 50%;
  display: grid;
  margin: 1rem;
  grid-template-columns: 1fr 7fr;
  box-shadow:
      inset -0.25rem -0.25rem 0.25rem #777,
      inset  0.25rem  0.25rem 0.25rem lightgrey;
}

span {
  padding: 0.5rem;
  margin: 0.125rem;
}

.column-label{
  padding: 0.25rem;
  margin: 0;
  font-weight: bold;
  text-align: center;
  border: none;
}

.universe-id {
  text-align: center;
}

.universe-name {
  text-align: left;
}

.selected {
  background-color: var(--color-background);
  box-shadow:
      inset -0.08rem -0.08rem 0.125rem var(--color-text),
      inset   0.08rem 0.08rem 0.125rem var(--color-text);
  font-weight: bold;
}
</style>