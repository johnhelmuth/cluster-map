<script setup>
import Bezel from "../components/Bezel.vue";

const appVersion = typeof __APP_VERSION !== "undefined" ? `v${__APP_VERSION}` : "Unknown";

</script>

<template>
  <Bezel>
    <template v-slot:controls >
      <div class="about">
        <div class="about-box">
          <h1>About Cluster Map</h1>
          <main>
            <p>Cluster Map is an attempt to dynamically capture the star system cluster information from my Space Opera RPG Game <em>In Dire Straits.</em></p>
          </main>
          <footer><span class="left">Version {{ appVersion }}</span><span class="right">Copyright John Helmuth 2024</span></footer>
        </div>
      </div>
    </template>
  </Bezel>
</template>

<style scoped>

.about {
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.about-box {
  flex: 0 1 auto;
  height: 100%;
  margin: 1rem;
  width: 50rem;
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  padding: 2rem;
  background-color: var(--color-background-soft);
  border-radius: 1rem;
  font-size: 2rem;
}

h1 {
  text-align: center;
  flex: 0 1 auto;
  font-size: 3rem;
}

main {
  flex: 1 1 auto;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin: 1rem;
}

footer {
  text-align: center;
  margin: 1rem;
  min-height: 1rem;
  display: flex;
  flex-direction: row;
  flex-flow: row nowrap;
  justify-content: space-between;
  font-size: 1rem;
}
</style>
