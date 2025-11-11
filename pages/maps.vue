<script setup lang="ts">

import {useClustersStore} from "~/stores/use-clusters-store";

useSeoMeta({
  title: 'Cluster Maps',
});
useServerSeoMeta({
  title: 'Cluster Maps',
});

const clustersStore = useClustersStore();

</script>

<template>
  <InfoPage page_title="Cluster Maps">
    <div class="cluster-maps">
      <ul class="cluster-map-list">
        <li class="clusters-map-item"
            :class="cluster === clustersStore.clusters.cluster ? 'selected-cluster' : ''"
            v-for="cluster in clustersStore.clusters.clusters"
            :key="cluster.id"
            :id="cluster.id"
        >
          <NuxtLink :to="{name: 'map-clusterSlug', params: { clusterSlug: cluster.slug }}">
            <div class="map-thumbnail">
              <SVGClusterGraph
                  v-if="cluster"
                  :cluster="cluster"
                  @system-selected="(() => null)()"
                  :debug="false"
                  mapStyle="data"
              />
            </div>
            <div class="cluster-name">
              {{ cluster.name }}
            </div>
          </NuxtLink>
        </li>
      </ul>
    </div>
  </InfoPage>
</template>

<style scoped>
ul.cluster-map-list {
  list-style: none;
  display: grid;
  grid-template-columns: 1fr 2fr;
  align-items: center;
  justify-items: center;
}
ul.cluster-map-list > li {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: subgrid;
}
ul.cluster-map-list > li > a {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: subgrid;
  align-items: center;
  justify-items: center;
}
div.map-thumbnail {
  grid-column: 1 / 2;
}
div.cluster-name {
  grid-column: 2 / -1;
  font-size: 1.5rem;
  justify-self: left;
  margin-left: 1rem;
}
div.map-thumbnail svg {
  width: 30cqw;
  height: 30cqw;
}
</style>