<script setup lang="ts">

useSeoMeta({
  title: () => `About`,
})

</script>

<template>
  <InfoPage page_title="About Cluster Map" max-width-rems="30" include-footer>
    <main>
      <p>This site is an attempt to be used for the storage and reference for everything from our Space Opera RPG
        Campaign <em>In Dire Straits.</em></p>
      <p><NuxtLink to="/tatterpedia">Tatterpedia</NuxtLink> is a conglomeration of setting, rules, and story information from the campaign in a loose wiki-like structure.</p>
      <p>The <NuxtLink to="/maps">Cluster Maps</NuxtLink> and the maps it points to are an attempt to visualize the relationships between star systems in the
        Clusters of Known Space, and to allow planning jump routes between star systems.</p>
    </main>
    <ul class="players">
      <h2>Players</h2>
      <li>Jon T.</li>
      <li>Robert L.</li>
      <li>Kit</li>
      <li>Evan</li>
      <li>Pete</li>
    </ul>
  </InfoPage>
</template>
