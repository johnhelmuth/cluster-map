<script setup lang="ts">

import {dateFormat, leadingZeros} from "~/utils/utils";

/**
 * staleDatePeriods - array of dates marking the periods at the end of a number of weeks in the past.
 *
 *  Index | Date of 2025-11-22 - ((Index+1) * 7 + 1)
 *    0   | 2025-11-15
 *    1   | 2025-11-08
 *    2   | 2025-11-01
 *    3   | 2025-10-25
 */
const staleDatePeriods = [1, 2, 3, 4].map(weeks => {
  const stale_date = new Date();
  stale_date.setDate(stale_date.getDate() - (weeks * 7));
  return dateFormat(stale_date);
});

const today = dateFormat(new Date());
const {data: story} = await useAsyncData('most-recent-news', async () => {
  // Only shows stories newer than the oldest date in stale_dates.
  const data = await queryCollection('content')
      .where('path', 'LIKE', '/news/%')
      .where('path', 'NOT LIKE', '/news/%/%')
      .where('publish_date', '<=', today)
      .where('publish_date', '>=', staleDatePeriods[staleDatePeriods.length - 1])
      .order('publish_date', 'DESC')
      .first()
  ;
  return data;
});

const storyAgePeriod = computed(() => {
  let storyAgePeriodValue = staleDatePeriods.length;
  if (story?.value && story.value.publish_date) {
    const storyDate = new Date(story.value.publish_date + 'T12:00:00Z'); // Avoid TZ issues by using noon, we are not using the time below.

    for (let periodIndex = 0; periodIndex < staleDatePeriods.length; periodIndex++) {
      const stalePeriodEndDate = staleDatePeriods[periodIndex] as string;
      const periodEndDate = new Date(stalePeriodEndDate);
      if (storyDate >= periodEndDate) {
        storyAgePeriodValue = periodIndex;
        break;
      }
    }
  }
  return storyAgePeriodValue;
});

const showNoNewsBlock = computed(() => {
  if (story?.value && story.value.publish_date && staleDatePeriods.length > 3) {
    const penultimateDate = staleDatePeriods[staleDatePeriods.length - 2];
    const ultimateDate = staleDatePeriods[staleDatePeriods.length - 1];
    if (penultimateDate && ultimateDate) {
      return penultimateDate > story.value.publish_date && story.value.publish_date >= ultimateDate;
    }
  }
  return false;
})
</script>

<template>

  <section class="latest-news-section" v-if="story || showNoNewsBlock">
    <h2>
      Latest site news
    </h2>
    <article class="latest-news" v-if="story && storyAgePeriod < staleDatePeriods.length-1" :class="`period-${storyAgePeriod}`">
      <h3 class="story-header">{{ story.title }}</h3>
      <p class="story-date">Published {{ story.publish_date }}</p>
      <ContentRenderer v-if="story" :value="story" class="story-body"/>
      <NuxtLink class="more-news-link" to="/news">More news...</NuxtLink>
    </article>
    <article class="latest-news" v-else v-if="showNoNewsBlock">
      <h3 class="story-header">
        No recent news.
      </h3>
      <p>You should probably bug the webmaster about that.</p>
      <NuxtLink class="more-news-link" to="/news">Older news...</NuxtLink>
    </article>
  </section>
</template>

<style scoped>

section.latest-news-section h2 {
  margin: 1rem 0 0;
  text-align: center;
}

article.latest-news {
  grid-area: sidebar;
  background-color: var(--color-background);
  --color-border-age: var(--color-border);
  box-shadow: 0 0 .90rem var(--color-border-age),
  inset 0 0 .50rem var(--color-border-age);
  border-radius: 1rem;
  padding: .75rem;
  margin: .5rem .5rem auto 1rem;
}

/** Fresh, hot off the presses, action green **/
article.latest-news.period-0 {
  --color-border-age: var(--color-action-background);
}

/** Getting old, make it orange. **/
article.latest-news.period-1 {
  --color-border-age: var(--vt-c-orange);
}

/** Almost falling off, make it a faded yellow. **/
article.latest-news.period-2 {
  --color-border-age: var(--vt-c-amber-lightest);
}

/** Nothing within first 3 periods, mark the "no news" block. **/
article.latest-news.period-3 {
  --color-border-age: var(--color-border);
}

article.latest-news h3.story-header {
  padding: 0.5rem 1rem 0;
  text-align: left;
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