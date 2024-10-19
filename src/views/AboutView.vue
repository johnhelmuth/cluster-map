<script setup>
import Bezel from "../components/Bezel.vue";

const appVersion = typeof __APP_VERSION !== "undefined" ? `v${__APP_VERSION}` : "Unknown";

</script>

<template>
  <Bezel>
    <template v-slot:display  class="about">
      <div class="about">
        <h1>About Cluster Map</h1>
        <main>
          <p>Cluster Map is an attempt to dynamically capture the star system cluster information from my Space Opera RPG Game <em>In Dire Straits.</em></p>
        </main>
        <footer>Version {{ appVersion }}</footer>
      </div>
    </template>
  </Bezel>
</template>

<style scoped>

.about {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 1rem;
}

h1 {
  text-align: center;
  flex: 0 1 auto;
}

main {
  flex: 1 1 auto;
}

footer {
  text-align: center;
  margin: 1rem;
  min-height: 1rem;
}
</style>
