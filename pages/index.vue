<script setup lang="ts">

const route = useRoute();

useSeoMeta({
  title: () => `In Dire Straits`,
})
</script>

<template>
  <InfoPage page_title="In Dire Straits">
    <section class="intro">
      <p>
        <strong>In Dire Straits</strong> is a Space Opera RPG campaign created and played by the In Dire Straits
        players using the Fate Core System ruleset.
      </p>
    </section>
    <section class="site-links">

      <h2>
        <NuxtLink to="/tatterpedia">Tatterpedia</NuxtLink>
      </h2>

      <p>The conglomeration of all known information in known space, available on the interstellar Tatternet.</p>

      <h2>
        <NuxtLink to="/sessions">Session Summaries</NuxtLink>
      </h2>

      <p>The story of the crew of the Dire Straits, session by session.</p>

      <h2>
        <NuxtLink to="/rules-and-systems">Rules & Systems</NuxtLink>
      </h2>

      <p>The rules and systems we are using to play In Dire Straits.</p>

      <h2>
        <NuxtLink to="/maps">Cluster Maps</NuxtLink>
      </h2>

      <p>
        A standard tool used for discovering information about star systems in the local cluster, and to plan
        strait routes between them. All starships include the cluster map interface as part of their navigation
        controls, and all space station and most cities that have star ports have kiosks with the same interface.
      </p>
    </section>

    <LatestNews class="latest-news-section"/>

  </InfoPage>
</template>

<style scoped>

:deep(div.info-box > div.info-content[class]) {
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-template-rows: min-content min-content;
  grid-template-areas: "intro intro"
                       "content content";
}
:deep(div.info-box > div.info-content[class]:has(section.latest-news-section)) {
  grid-template-areas: "intro intro"
                       "content sidebar";
}

@media (max-width: 1600px) {
  :deep(div.info-box > div.info-content[class]) {
    grid-template-columns: 2fr 2fr;
  }
}

@media (max-width: 1300px) {
  :deep(div.info-box > div.info-content[class]:has(section.latest-news-section)) {
    grid-template-columns: 1fr;
    grid-template-areas: "intro"
      "content"
      "sidebar";
  }
}
section.intro {
  grid-area: intro;
}
section.site-links {
  grid-area: content;
  height: min-content;
}
</style>