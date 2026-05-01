<script setup lang="ts">

import {useClustersStore} from "~/stores/use-clusters-store";
import type {ClusterIdType} from "~/types/ClusterTypes";

const clustersStore = useClustersStore();

</script>

<template>

  <InfoPage page_title="Clusters Map">
    <div class="clusters-map">
      <SVGClustersMap :viewBox="{ x: 0, y: 0, width: 1000, height: 750 }" />
    </div>
  </InfoPage>

</template>

<style scoped>

:global(.info-content:has(.clusters-map)) {
  padding: 0;
}

.clusters-map {
  --svg-background-color: transparent;
  background: var(--svg-background-color);
  width: 100%;
  height: 100%;
  position: relative;
  container-type: size;
  container-name: map-panel;
  margin: 0;
}

.clusters-map > svg {
  width: 100%;
  height: 100%;
  display: block;
}

.clusters-map > svg .background {
  fill: var(--svg-background-color);
}
</style>