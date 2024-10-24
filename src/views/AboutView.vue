<script setup>

import InfoPageLayout from "@/layouts/InfoPageLayout.vue";

</script>

<template>
  <InfoPageLayout page_title="About Cluster Map" max-width-rems="30">
    <template v-slot:page_contents>
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
    </template>
  </InfoPageLayout>
</template>

<style scoped>

h2 {
  text-align: center;
  flex: 0 1 auto;
  font-weight: bold;
}

main {
  flex: 2 1 auto;
  margin: 1rem;
}

.players {
  flex: 1 1 auto;
  margin: 2rem auto;
}

</style>
