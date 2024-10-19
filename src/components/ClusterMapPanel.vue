<script setup>

import { inject } from 'vue'

const cluster = inject('cluster');

</script>

<template>
  <div class="cluster-map-panel">
    <!-- TODO: Replace this with THREE.js code rendering the data. -->
    <!--  <img src="@/assets/cluster-map-manual.svg">-->
  </div>
</template>

<style scoped>

.cluster-map-panel {
  width: 100%;
  height: 100%;
}

img {
  width: 100%;
  height: 100%;
}

</style>
