<script setup lang="ts">

import {useUniversesStore} from "~/stores/use-universes-store";

const universesStore = useUniversesStore();

async function selectUniverse(e: Event) {
  const universeId = e.target?.id;
  if (universeId) {
    universesStore.universes.setCurrentUniverse(universeId);
  }
}
</script>

<template>

  <InfoPage page_title="Universes">
    <div class="universes-page">
      <div class="universes-view">
        <div class="note">Click on a universe in the list to select.</div>
        <div class="note">TODO: Implement something better looking here.</div>
        <ul class="universe-list">
          <li class="universe-list-item"
              v-for="aUniverse in universesStore?.universes?.universesMetadata || []"
              :class="{ 'selected-universe': (aUniverse.id === universesStore.universes.universe?.id)}"
              :key="aUniverse.id"
              :id="aUniverse.id"
              @click="selectUniverse"
          >
            {{ aUniverse.id }} - {{ aUniverse.description }} {{ aUniverse.isLoaded ? "- Loaded" : "- Not loaded"}}
          </li>
        </ul>
      </div>
    </div>
  </InfoPage>
</template>

<style scoped>


li.selected-universe {
  font-weight: bold;
}
</style>