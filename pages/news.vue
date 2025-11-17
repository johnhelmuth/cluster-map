<script setup lang="ts">

const route = useRoute()

const {data: news} = await useAsyncData(route.path, async () => {
  const data = await queryCollection('content')
      // .select('id', 'title', 'description', 'path', 'meta', 'publish_date')
      .where('path', 'LIKE', '/news/%')
      .where('path', 'NOT LIKE', '/news/%/%')
      .order('publish_date', 'DESC')
      .all()
  ;
  return data;
});
</script>

<template>
  <InfoPage page_title="Site News">
    <ul v-if="news && news.length > 0">
      <li v-for="(story, index) in news" :key="news.id">
        <div class="news-title">
          <h2><NuxtLink :to="story.path">{{ story.title }}</NuxtLink></h2>
        </div>
        <div class="news-date">{{ story.publish_date }}</div>
        <div class="news-body">
          <ContentRenderer v-if="story" :value="story"/>
        </div>
      </li>
    </ul>
  </InfoPage>
</template>

<style scoped>
ul {
  padding-inline-start: 0;
}

li {
  list-style-type: none;
  display: grid;
  grid-template-areas:
     "title-link news-date"
     "body body";
  grid-template-columns: 1fr max-content;
  grid-template-rows: min-content;
  font-size: 1rem;
  margin-bottom: 0.75rem;
  justify-content: center;
  align-items: center;
  background-color: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: .75rem;
  padding: 1rem;
}

li div {
  padding: 0.5rem;
  border-radius: 0.33rem;
}

li.header div {
  margin-bottom: 0;
}

li div.news-title {
  grid-area: title-link;
}
li div.news-title h2 {
  margin: 0;
}

li div.news-date {
  grid-area: news-date;
}
li div.news-date:before {
  content: "Published ";
}
li div.news-body {
  grid-area: body;
}
</style>