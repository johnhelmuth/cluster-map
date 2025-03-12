<script setup lang="ts">

import {useUniversesStore} from "~/stores/use-universes-store";

const universesStore = useUniversesStore();

function addCluster(event: Event) {
  if (universesStore.hasUniverse()) {
    const newCluster = createCluster('', '', getRandomIntInclusive(4, 9));
    const notUnique = !!universesStore.universes.universe?.getClusterById(newCluster.id);
    if (!notUnique) {
      universesStore.universes.universe?.addCluster(newCluster);
    }
  }
}

function selectCluster(event: Event) {
  const clusterElement = event.target as HTMLElement;
  if (universesStore.hasUniverse() && clusterElement?.id) {
    const selectedClusterId = clusterElement.id;
    const selectedCluster = universesStore.universes.universe?.getClusterById(selectedClusterId);
    if (universesStore.universes.universe?.cluster && selectedCluster !== universesStore.universes.universe?.cluster) {
      universesStore.universes.universe.cluster = selectedCluster;
    }
  }
}

</script>

<template>
  <InfoPage page_title="Universe">
    <div class="universes-page">
      <div class="universe-view">
        <div class="note">Click on a cluster in the list to select.</div>
        <div class="note">TODO: Implement something better looking here.</div>
        <div class="add-action">
          <button class="action" @click="addCluster">Add new Cluster</button>
        </div>
        <ul class="cluster-list">
          <li class="cluster-list-item"
              :class="universesStore.hasUniverse() && aCluster === universesStore.universes.universe?.cluster ? 'selected-cluster' : ''"
              v-for="aCluster in universesStore.universes.universe?.clusters || []"
              :key="aCluster.id"
              :id="aCluster.id"
              @click="selectCluster"
          >
            {{ aCluster.id }} - {{ aCluster.name }}
          </li>
        </ul>
      </div>
<!--      <div class="clusters-settings-panel">-->
<!--        <ClustersSettingsPanel/>-->
<!--      </div>-->
    </div>
  </InfoPage>
</template>

<style scoped>

.universes-page {
  display: grid;
  grid-template-columns: 1fr;
  /* grid-template-columns: 3fr 1fr; */
  container: clusters-page / size;
}

li.selected-cluster {
  font-weight: bold;
}

.note {
  margin: 2em;
}

.add-action {
  margin: auto 2em 2em;
}
</style>
