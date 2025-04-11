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
  if (target.dataset.universeId !== undefined || target.parentElement?.dataset.universeId !== undefined) {
    const universeId = (target.dataset.universeId || target.parentElement?.dataset.universeId);
    if (universeId) {
      await universesStore.setCurrentUniverseId(universeId);
    }
  }
}

</script>

<template>
  <InfoPage page_title="Universes">
    <div class="universes">
      <div class="universe-list-container">
        <div v-if="universesStore.universesMetadata.length" class="universes-list">
          <div class="universe-list-header row">
            <span></span><span class="column-label">ID</span><span class="column-label">Name</span>
          </div>
          <div
              v-for="(universeMetadata, index) in universesStore.universesMetadata" :key="index"
              class="row universe-row"
              :data-universe-id="universeMetadata.id"
              @click="selectUniverse"
              :class="universeRowClass(universeMetadata)"
          >
            <span class="universe-select">
              <input type="radio" name="universeSelected" :checked="universeMetadata.id === universesStore.currentUniverseId" />
            </span>
            <span class="universe-id">
              {{ universeMetadata.id }}
            </span>
            <span class="universe-name">
              {{ universeMetadata.name }}
            </span>
          </div>
        </div>
      </div>
      <div class="universes-import-export-panel">
        <UniversesImportExportPanel/>
      </div>
    </div>
  </InfoPage>
</template>

<style scoped>

.universes {
  display: grid;
  grid-template-columns: 2fr 1fr;
  container: clusters-page / size;
}

.universes-list {
  display: grid;
  margin-right: 0.5rem;
  padding: 0.5rem;
  grid-template-columns: 1fr 2fr 7fr;
  box-shadow: inset -0.25rem -0.25rem 0.25rem #777,
  inset 0.25rem 0.25rem 0.25rem lightgrey;
}

.universes-list .row {
  display: grid;
  grid-template-columns: subgrid;
  grid-column: 1 / 4;
}

span {
  padding: 0.5rem;
  margin: 0.125rem;
}

.column-label {
  padding: 0.25rem;
  margin: 0;
  font-weight: bold;
  text-align: center;
  border: none;
}

.universe-row {
  color: grey;
}

.universe-id {
  text-align: center;
}

.universe-name {
  text-align: left;
}

.loaded span {
  color: var(--color-text);
}

</style>