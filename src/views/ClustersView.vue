
<script setup lang="ts">

import type {ClusterModelInterface, ClustersModelInterface} from "@/types/ClusterTypes";

import {useClustersStore} from "@/stores/ClustersStore";

const {clusters} = useClustersStore() as { clusters: ClustersModelInterface };

import createCluster, {getRandomIntInclusive} from "@/utilities/ClusterGenerator";

function addCluster(event: Event) {
  const newCluster = createCluster('', '', getRandomIntInclusive(4, 9));
  const notUnique = !! clusters.getClusterById(newCluster.id);
  if (! notUnique) {
    clusters.addCluster(newCluster);
  }
}

function selectCluster(event: Event) {
  const clusterElement = event.target as HTMLElement;
  if (clusterElement?.id) {
    const selectedClusterId = clusterElement.id;
    const selectedCluster = clusters.getClusterById(selectedClusterId);
    if (selectedCluster !== clusters.cluster) {
      clusters.cluster = selectedCluster;
    }
  }
}

</script>

<template>
  <div class="clusters-view">
    <div class="note">Click on a cluster in the list to select.</div>
    <div class="note">TODO: Implement something better looking here.</div>
    <div class="add-action"><button class="action" @click="addCluster">Add new Cluster</button></div>
    <ul class="clusters-list">
      <li class="clusters-list-item" :class="aCluster === clusters.cluster ? 'selected-cluster' : ''" v-for="aCluster in clusters.clusters" :key="aCluster.id" :id="aCluster.id" @click="selectCluster">
          {{ aCluster.id }} - {{ aCluster.name }}
      </li>
    </ul>
  </div>
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
