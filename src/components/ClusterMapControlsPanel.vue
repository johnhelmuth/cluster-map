

<script setup>
import { inject } from 'vue'
import SystemInfoCard from "@/components/SystemInfoCard.vue";

const cluster = inject('cluster');

</script>

<template>
  <div class="cluster-map-controls">
    <h1>{{ cluster.name ? cluster.name : "Cluster"}}</h1>
    <div class="panel-body">
      <SystemInfoCard v-for="system in cluster.getSystems()" :system="system" :key="system.id" />
    </div>
  </div>
</template>

<style scoped>

h1 {
  border-radius: 0.5rem;
  box-shadow: inset -0.1rem -0.1rem 0.1rem grey,
              inset 0.1rem 0.1rem 0.1rem lightgrey;
  padding: 0.5rem;
  text-align: center;
}
.cluster-map-controls {
  border-radius: 0.5rem;
  padding: 0 1em;
  margin-left: 1rem;
  display: flex;
  flex-direction: column;
  height: 100%;
}

@media (max-width: 1024px) {
  .cluster-map-controls {
    border-radius: 0.25rem;
    padding: 0 0.25rem;
    margin-left: 0.5rem;
  }
}

.panel-body {
  overflow-y: scroll;
}
</style>
