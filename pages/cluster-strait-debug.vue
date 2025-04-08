<script setup lang="ts">

import {useUniverseStore} from "~/stores/use-universe-store";
import {mapViewStyleLabels, type MapViewStylesType} from "~/types/MapViewTypes";

const universeStore = useUniverseStore();
const cluster = computed(() => universeStore.clusters.cluster);

const mapViewStyles = ref(mapViewStyleLabels.map(({key}) => key) as Array<MapViewStylesType>);

function clusterSelected(event: Event) {
  const targetSelect = event.target as HTMLSelectElement;
  const clusterId = targetSelect.value;
  const newCluster = universeStore.clusters.getClusterById(clusterId);
  if (newCluster) {
    universeStore.clusters.cluster = newCluster;
  }
}

</script>

<template>
  <div class="cluster-strait-debug-page">
    <form>
      <select class="clusterSelect" @change="clusterSelected">
        <option v-for="clusterItem in universeStore.clusters.clusters"
                :value="clusterItem.id"
                :key="clusterItem.id"
                :id="clusterItem.id"
                :selected="clusterItem === cluster"
        >
          {{ clusterItem.name }}
        </option>
      </select>
      <fieldset class="map-view-style-selector">
        <legend>Show only</legend>
        <ul>
          <li v-for="styleData in mapViewStyleLabels">
            <label><input type="checkbox" :value="styleData.key" v-model="mapViewStyles" name="mapStyles"
                          style="margin-right: 1rem;"/>{{ styleData.label }}</label>
          </li>
        </ul>
      </fieldset>
    </form>
    <ul class="system-cluster-list" v-if="cluster">
      <li v-for="[systemId, straits] in cluster.getStraitsInSystemOrder()">
        <p>{{ systemId }} <span>{{ cluster.getSystemById(systemId)?.name || 'unknown' }}</span></p>
        <ul v-if="straits.length">
          <li>
            Index - To System Id Name
            <template v-for="view in ['data', 'circular', 'linear'] as MapViewStylesType[]">
              <span v-if="mapViewStyles.includes(view)">
                - {{ view }}
              </span>
            </template>
          </li>
          <li v-for="(strait, index) in straits" :key="strait.id">
            <p>-> {{ index }} - {{ strait.systemB.id }} {{ strait.systemB.name }}
              <template v-for="view in ['data', 'circular', 'linear'] as MapViewStylesType[]">
              <span v-if="mapViewStyles.includes(view)" :key="`${index} + ${view}`">
                - {{ strait.getDrawDirection(view) }}
              </span>
              </template>
            </p>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<style scoped>

form {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
}

.map-view-style-selector {
  font-size: 0.8rem;
  border: none;
}

.map-view-style-selector ul {
  list-style-type: none;
  font-size: 0.8rem;
  padding: 0;
}

.system-cluster-list {
  height: calc(75cqh);
  overflow-y: scroll;
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  margin: auto 0.5rem;
}
.system-cluster-list, .system-cluster-list ul {
  list-style-type: none;
}
</style>