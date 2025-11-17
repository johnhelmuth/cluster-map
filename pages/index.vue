<script setup lang="ts">

const {data: story} = await useAsyncData('most-recent-news', async () => {
  // Only shows stories newer than 3 weeks.
  const STALE_AGE = 3 * 7;
  const stale_date = new Date();
  stale_date.setDate(stale_date.getDate() - STALE_AGE);
  const stale_day = stale_date.toISOString().substring(0, 10);


  const data = await queryCollection('content')
      .where('path', 'LIKE', '/news/%')
      .where('path', 'NOT LIKE', '/news/%/%')
      .where('publish_date', '>=', stale_day)
      .order('publish_date', 'DESC')
      .first()
  ;
  return data;
});
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

    <section class="latest-news-section">
      <h2>
        Latest site news
      </h2>
      <article class="latest-news" v-if="story">
        <h3 class="story-header">{{ story.title }}</h3>
        <p class="story-date">Published {{ story.publish_date }}</p>
        <ContentRenderer v-if="story" :value="story" class="story-body"/>
        <NuxtLink class="more-news-link" to="/news">More news...</NuxtLink>
      </article>
      <article class="latest-news" v-else>
        <h2>
          No recent news.
        </h2>
        <p>You should probably bug the webmaster about that.</p>
        <NuxtLink class="more-news-link" to="/news">Older news...</NuxtLink>
      </article>
    </section>

  </InfoPage>
</template>

<style scoped>

:deep(div.info-box > div.info-content[class]) {
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-template-rows: min-content min-content;
  grid-template-areas: "intro intro"
                       "content sidebar";
}

@media (max-width: 1600px) {
  :deep(div.info-box > div.info-content[class]) {
    grid-template-columns: 2fr 2fr;
  }
}

@media (max-width: 1300px) {
  :deep(div.info-box > div.info-content[class]) {
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

section.latest-news-section h2 {
  margin: 1rem 0 0;
  text-align: center;
}

article.latest-news {
  grid-area: sidebar;
  background-color: var(--color-background);
  box-shadow:       0 0 .90rem var(--color-action-background),
              inset 0 0 .50rem var(--color-action-background);
  border-radius: 1rem;
  padding: .75rem;
  margin: .5rem .5rem auto 1rem;
}

article.latest-news h3.story-header {
  padding: 0.5rem 1rem 0;
  text-align: center;
}

article.latest-news .story-date {
  margin-left: 1rem;
  margin-right: 1rem;
  font-size: 1rem;
  text-align: right;
  margin-bottom: 0;
}

article.latest-news .story-body {
  padding-left: 1rem;
  padding-right: 1rem;
}

.more-news-link {
  display: block;
  text-align: right;
  margin-right: 2rem;
}
</style>