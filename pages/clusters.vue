<script setup lang="ts">

import {useClustersStore} from "~/stores/use-clusters-store";

const clustersStore = useClustersStore();

function addCluster(event: Event) {
  console.log('addCluster()');
  const newCluster = createCluster('', '', getRandomIntInclusive(4, 9));
  const notUnique = !! clustersStore.clusters.getClusterById(newCluster.id);
  if (! notUnique) {
    clustersStore.clusters.addCluster(newCluster);
  }
}

function selectCluster(event: Event) {
  const clusterElement = event.target as HTMLElement;
  if (clusterElement?.id) {
    const selectedClusterId = clusterElement.id;
    const selectedCluster = clustersStore.clusters.getClusterById(selectedClusterId);
    if (selectedCluster !== clustersStore.clusters.cluster) {
      clustersStore.clusters.cluster = selectedCluster;
    }
  }
}

</script>

<template>
  <InfoPage page_title="Clusters">

    <div class="clusters-view">
      <div class="note">Click on a cluster in the list to select.</div>
      <div class="note">TODO: Implement something better looking here.</div>
      <div class="add-action"><button class="action" @click="addCluster">Add new Cluster</button></div>
      <ul class="clusters-list">
        <li class="clusters-list-item"
            :class="aCluster === clustersStore.clusters.cluster ? 'selected-cluster' : ''"
            v-for="aCluster in clustersStore.clusters.clusters"
            :key="aCluster.id"
            :id="aCluster.id"
            @click="selectCluster"
        >
          {{ aCluster.id }} - {{ aCluster.name }}
        </li>
      </ul>
    </div>
  </InfoPage>
</template>

<style scoped>
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
