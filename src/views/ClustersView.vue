
<script setup lang="ts">

import type {ClusterModelInterface, ClustersModelInterface} from "@/types/ClusterTypes";

import {useClustersStore} from "@/stores/ClustersStore";

const {clusters} = useClustersStore() as { clusters: ClustersModelInterface };
console.log('ClustersView.setup() clusters: ', clusters);

import createCluster from "@/utilities/ClusterGenerator";


function addCluster(event: Event) {
  const newCluster = createCluster('', '', 9);
  console.log('clusters: ', clusters);
  const notUnique = !! clusters.getClusterById(newCluster.id);
  console.log('newCluster: ', newCluster);
  console.log('notUnique: ', notUnique);
  if (! notUnique) {
    clusters.addCluster(newCluster);
  }
}

function selectCluster(event: Event) {
  const clusterElement = event.target as HTMLElement;
  if (clusterElement?.id) {
    const selectedClusterId = clusterElement.id;
    console.log('selectedClusterId: ', selectedClusterId);
    const selectedCluster = clusters.getClusterById(selectedClusterId);
    console.log('selectedCluster: ', selectedCluster);
    console.log('clusters.cluster: ', clusters.cluster);
    if (selectedCluster !== clusters.cluster) {
      console.log('new cluster selected.');
      clusters.cluster = selectedCluster;
    }
  }
}

</script>

<template>
  <div class="clusters-view">
    <ul class="clusters-list">
      <li class="clusters-list-item" :class="aCluster === clusters.cluster ? 'selected-cluster' : ''" v-for="aCluster in clusters.clusters" :key="aCluster.id" :id="aCluster.id" @click="selectCluster">
          {{ aCluster.id }} - {{ aCluster.name }}
      </li>
      <li class="clusters-list-item add-action"><button class="action" @click="addCluster">Add new Cluster</button></li>
    </ul>
  </div>
</template>

<style scoped>
li.selected-cluster {
  font-weight: bold;
}
</style>
