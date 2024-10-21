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
          <div class="content">
            <main>
              <p>Cluster Map is an attempt to dynamically capture the star system cluster information from our Space Opera RPG Campaign <em>In Dire Straits.</em></p>
            </main>
            <ul class="players">
              <h2>Players</h2>
              <li>Jon T.</li>
              <li>Robert L.</li>
              <li>Kit</li>
              <li>Evan</li>
            </ul>
          </div>
          <footer><span class="left">Version {{ appVersion }}</span><span class="right">&copy; John Helmuth and the In Dire Straits players 2024</span></footer>
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
  min-height: 50cqh;
  max-height: 75cqh;
  margin: 1rem;
  max-width: 40rem;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  padding: 2rem;
  padding-bottom: 1rem;
  background-color: var(--color-background-soft);
  border-radius: 1rem;
  border: .25px solid var(--color-background-lightest);
  box-shadow: inset -0.25rem -0.25rem 0.25rem #777,
  inset  0.25rem  0.25rem 0.25rem lightgrey;
}

h1 {
  text-align: center;
  flex: 0 1 auto;
  font-weight: bold;
}
h2 {
  text-align: center;
  flex: 0 1 auto;
  font-weight: bold;
}

.content {
  overflow-y: scroll;
  flex: 2 1 auto;
}
main {
  flex: 2 1 auto;
  margin: 1rem;
}

.players {
  flex: 1 1 auto;
  margin: 2rem auto;
}

footer {
  text-align: center;
  min-height: 1rem;
  flex: 0 1 auto;
  justify-self: end;
  display: flex;
  flex-direction: row;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: end;
  font-size: .8rem;
}
footer span {
  width: 48%;
  text-align: left;
}
footer span.right {
  text-align: right;
}
</style>
