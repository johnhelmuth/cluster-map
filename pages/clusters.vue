<script setup lang="ts">

import {useUniverseStore} from "~/stores/use-universe-store";
import {createCluster} from "~/utils/cluster-generator";

const universeStore = useUniverseStore();

function addCluster(event: Event) {
  const newCluster = createCluster('', '', getRandomIntInclusive(4, 9));
  const notUnique = !! universeStore.clusters.getClusterById(newCluster.id);
  if (! notUnique) {
    universeStore.clusters.addCluster(newCluster);
  }
}

function selectCluster(event: Event) {
  const clusterElement = event.target as HTMLElement;
  if (clusterElement?.id) {
    const selectedClusterId = clusterElement.id;
    const selectedCluster = universeStore.clusters.getClusterById(selectedClusterId);
    if (selectedCluster !== universeStore.clusters.cluster) {
      universeStore.clusters.cluster = selectedCluster;
    }
  }
}

</script>

<template>
  <InfoPage page_title="Clusters">
    <div class="clusters-page">
      <div class="clusters-view">
        <div class="note">Click on a cluster in the list to select.</div>
        <div class="note">TODO: Implement something better looking here.</div>
        <div class="add-action">
          <button class="action" @click="addCluster">Add new Cluster</button>
        </div>
        <ul class="clusters-list">
          <li class="clusters-list-item"
              :class="aCluster === universeStore.clusters.cluster ? 'selected-cluster' : ''"
              v-for="aCluster in universeStore.clusters.clusters"
              :key="aCluster.id"
              :id="aCluster.id"
          >
            <NuxtLink :to="{name: 'map-clusterSlug', params: { clusterSlug: aCluster.slug }}">
              {{ aCluster.id }} - {{ aCluster.name }}
            </NuxtLink>
          </li>
        </ul>
      </div>
      <div class="clusters-settings-panel">
        <ClustersSettingsPanel />
      </div>
    </div>
  </InfoPage>
</template>

<style scoped>

.clusters-page {
  display: grid;
  grid-template-columns: 3fr 1fr;
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
