<script setup lang="ts">

import {useClustersStore} from "~/stores/use-clusters-store";
import {createCluster} from "~/utils/cluster-generator";
import type {ClusterIdType} from "~/types/ClusterTypes";

const clustersStore = useClustersStore();

function addCluster(event: Event) {
  const newCluster = createCluster('', '', getRandomIntInclusive(4, 9), clustersStore.clusters);
  const notUnique = !!clustersStore.clusters.getClusterById(newCluster.id);
  if (!notUnique) {
    clustersStore.clusters.addCluster(newCluster);
  }
}

function getClusterIdFromElement(targetElement: HTMLElement) {
  const clusterElement = targetElement.closest('[data-cluster-id]') as HTMLElement;
  if (clusterElement?.dataset.clusterId) {
    return clusterElement.dataset.clusterId as ClusterIdType;
  }
}

function selectCluster(clusterId: ClusterIdType) {
  if (clusterId) {
    const selectedCluster = clustersStore.clusters.getClusterById(clusterId);
    if (selectedCluster !== clustersStore.clusters.cluster) {
      clustersStore.clusters.cluster = selectedCluster;
    }
  }
}

function selectClusterClicked(event: Event) {
  const selectedClusterId = getClusterIdFromElement(event.target as HTMLElement);
  if (selectedClusterId) {
    selectCluster(selectedClusterId);
  }
}

function showMap(event: Event) {
  const selectedClusterId = getClusterIdFromElement(event.target as HTMLElement);
  if (selectedClusterId) {
    selectCluster(selectedClusterId);
    const aCluster = clustersStore.clusters.getClusterById(selectedClusterId);
    if (aCluster) {
      navigateTo({name: 'map-clusterSlug', params: { clusterSlug: aCluster.slug }});
    }
  }
}

</script>

<template>
  <InfoPage page_title="Clusters">
    <div class="clusters-page">
      <div class="clusters-view">
        <div class="note">Click on a cluster name in the list to select.</div>
        <div class="note">TODO: Implement something better looking here.</div>
        <div class="add-action">
          <button class="action" @click="addCluster">Add new Cluster</button>
        </div>
        <h2>Cluster List</h2>
        <ul class="clusters-list">
          <li class="clusters-list-item"
              :class="aCluster === clustersStore.clusters.cluster ? 'selected-cluster' : ''"
              v-for="aCluster in clustersStore.clusters.clusters"
              :key="aCluster.id"
              :id="aCluster.id"
              :data-cluster-id="aCluster.id"
          >
            <h3 class="cluster-identification"
                @click="selectClusterClicked">

              <NuxtLink :to="{name: 'map-clusterSlug', params: { clusterSlug: aCluster.slug }}">
                <span class="cluster-id">{{ aCluster.id }} - </span><span class="cluster-name">{{
                  aCluster.name
                }}</span>
              </NuxtLink>
            </h3>
            <button class="show-map-button" @click="showMap">Show map</button>
            <div v-if="aCluster.hasClusterStraits()" class="cluster-connections">
              <h4 class="cluster-connections-title">Connections</h4>
              <ul class="cluster-connection-list">
                <li v-for="clusterStrait of aCluster.getClusterStraits()">
                  <p v-for="straitPoint in [clusterStrait.getStraitPointInCluster(aCluster)]">
                    <template v-if="straitPoint">
                      <span class="cluster-strait-point">{{
                          straitPoint.cluster.name
                        }}/{{ straitPoint.system.name }}</span>
                        {{ clusterStrait?.galacticDirection }} to
                        <span class="cluster-strait-point">{{
                            clusterStrait.getOtherStraitPoint(straitPoint).cluster.name
                          }}/{{ clusterStrait.getOtherStraitPoint(straitPoint).system.name }}</span>
                    </template>
                  </p>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
      <div class="clusters-settings-panel">
        <ClustersSettingsPanel/>
      </div>
    </div>
  </InfoPage>
</template>

<style scoped>

.clusters-page {
  display: grid;
  grid-template-columns: 3fr 1fr;
  container: clusters-page / size;
  column-gap: 1rem;
}

ul {
  list-style: none;
}

ul.clusters-list {
  display: grid;
  grid-template-columns: auto 7rem;
  column-gap: 1rem;
  row-gap: 0.5rem;
}

ul.clusters-list li.clusters-list-item {
  grid-column: 1/-1;
  display: grid;
  grid-template-columns: subgrid;
  padding-top: 0.5rem;
  border-top: 0.5px solid var(--color-border);
}

ul.clusters-list li h3 {
  grid-column: 1 / 2;
  padding-left: 0;
}

ul.clusters-list li h3 span {
  font-weight: inherit;
  font-style: inherit;
}


ul.clusters-list li.selected-cluster h3 {
  font-style: italic;
}

ul.clusters-list li .show-map-button {
  height: 2rem;

}

.clusters-list h4 {
  font-size: 1rem;
  padding-left: 0.8rem;
}

.cluster-strait-point {
  font-style: italic;
}

.note {
  margin: 2em;
}

.add-action {
  margin: auto 2em 2em;
}
</style>
