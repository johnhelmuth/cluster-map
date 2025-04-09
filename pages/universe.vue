<script setup lang="ts">

import {useUniversesStore} from "~/stores/use-universes-store";
import {createCluster} from "~/utils/cluster-generator";

const universeStore = useUniversesStore();

function addCluster(event: Event) {
  if (universeStore.universe) {
    const newCluster = createCluster('', '', getRandomIntInclusive(4, 9));
    const notUnique = !!universeStore.universe.getClusterById(newCluster.id);
    if (!notUnique) {
      universeStore.universe.addCluster(newCluster);
    }
  }
}

function selectCluster(event: Event) {
  const clusterElement = event.target as HTMLElement;
  if (clusterElement?.id) {
    const selectedClusterId = clusterElement.id;
    if (universeStore.universe) {
      const selectedCluster = universeStore.universe.getClusterById(selectedClusterId);
      if (selectedCluster !== universeStore.universe.cluster) {
        universeStore.universe.cluster = selectedCluster;
      }
    }
  }
}

</script>

<template>
  <InfoPage page_title="Universe">
    <div class="clusters-page">
      <div class="clusters-view">
        <div class="note">Click on a cluster in the list to select.</div>
        <div class="note">TODO: Implement something better looking here.</div>
        <div class="add-action">
          <button class="action" @click="addCluster">Add new Cluster</button>
        </div>
        <ul class="clusters-list" v-if="universeStore.universe">
          <li class="clusters-list-item"
              :class="aCluster === universeStore.universe.cluster ? 'selected-cluster' : ''"
              v-for="aCluster in universeStore.universe.clusters"
              :key="aCluster.id"
              :id="aCluster.id"
              @click="selectCluster"
          >
            {{ aCluster.id }} - {{ aCluster.name }}
          </li>
        </ul>
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
