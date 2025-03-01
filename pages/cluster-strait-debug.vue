<script setup lang="ts">

import {useClustersStore} from "~/stores/use-clusters-store";
import type {MapViewStylesType} from "~/types/BasicTypes";

const clustersStore = useClustersStore();
const cluster = computed(() => clustersStore.clusters.cluster);


function clusterSelected(event: Event) {
  const targetSelect = event.target as HTMLSelectElement;
  const clusterId = targetSelect.value;
  const newCluster = clustersStore.clusters.getClusterById(clusterId);
  if (newCluster) {
    clustersStore.clusters.cluster = newCluster;
  }
}

</script>

<template>
<form>
  <select class="clusterSelect" @change="clusterSelected">
    <option v-for="clusterItem in clustersStore.clusters.clusters"
            :value="clusterItem.id"
            :key="clusterItem.id"
            :id="clusterItem.id"
            :selected="clusterItem === cluster"
    >
      {{ clusterItem.name }}
    </option>
  </select>
</form>
  <ul v-if="cluster">
    <li v-for="[systemId, straits] in cluster.getStraitsInSystemOrder()">
      <p>{{ systemId }} <span>{{ cluster.getSystemById(systemId)?.name || 'unknown'}}</span></p>
      <ul v-if="straits.length">
        <li>Index - To System Id Name - data - circular - linear</li>
        <li v-for="(strait, index) in straits" :key="strait.id">
          <p>-> {{index}} - {{strait.systemB.id}} {{strait.systemB.name}}
            <span v-for="view in ['data', 'circular', 'linear'] as MapViewStylesType[]" :key="`${index} + ${view}`">
              - {{ strait.getDrawDirection(view)}}
            </span>
          </p>
        </li>
      </ul>
    </li>
  </ul>

</template>

<style scoped>

</style>