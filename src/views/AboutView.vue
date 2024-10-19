<script setup>
import Bezel from "../components/Bezel.vue";
</script>

<template>
  <Bezel class="about">
    <template v-slot:display>
      <h1>About Cluster Map</h1>
      <main>Cluster Map is an attempt to dynamically capture the star system cluster information from my Space Opera RPG Game <em>In Dire Straits.</em></main>
    </template>
  </Bezel>
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>
