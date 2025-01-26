<script setup lang="ts">

import {useUniversesStore} from "~/stores/use-universes-store";

const universesStore = useUniversesStore();

function addCluster(event: Event) {
  console.log('addCluster()');
  const newCluster = createCluster('', '', getRandomIntInclusive(4, 9));
  const notUnique = !! universesStore.value.universe.getClusterById(newCluster.id);
  if (! notUnique) {
    universesStore.value.universe.addCluster(newCluster);
  }
}

function selectCluster(event: Event) {
  const clusterElement = event.target as HTMLElement;
  if (clusterElement?.id) {
    const selectedClusterId = clusterElement.id;
    const selectedCluster = universesStore.value.universe.getClusterById(selectedClusterId);
    if (selectedCluster !== universesStore.value.universe.cluster) {
      universesStore.value.universe.cluster = selectedCluster;
    }
  }
}

</script>

<template>
  <InfoPage page_title="Clusters">

    <div class="universe-view">
      <div class="note">Click on a cluster in the list to select.</div>
      <div class="note">TODO: Implement something better looking here.</div>
      <div class="add-action"><button class="action" @click="addCluster">Add new Cluster</button></div>
      <ul class="universe-list">
        <li class="universe-list-item"
            :class="aCluster === universesStore.universe.cluster ? 'selected-cluster' : ''"
            v-for="aCluster in universesStore.universe.clusters"
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
