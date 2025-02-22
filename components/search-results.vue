<script setup lang="ts">

import {type SearchResult} from "minisearch";

const props = defineProps<{
  search: string,
  results: SearchResult[],
  active?: boolean,
  hasMore?: boolean,
  isEmbedded?: boolean;
}>();

const showMoreLink = computed(() => !! props?.hasMore);

</script>

<template>
  <ul class="search-list" :class="{ embedded: isEmbedded }">
    <template v-if="results.length">
      <li v-for="link of results" :key="link.id">
        <div class="search-entry">
          <NuxtLink :to="link.id" class="search-card">
            <h2>{{ link.title }}</h2>
            <p>{{ link.content }}</p>
          </NuxtLink>
        </div>
      </li>
      <li v-if="showMoreLink">
        <NuxtLink :to="{ name: 'search', query: { search: search  } }">More results</NuxtLink>
      </li>
    </template>
    <li v-else>
      <div class="search-entry no-results">
        No results found.
      </div>
    </li>
  </ul>
</template>

<style scoped>

ul:has(.search-entry) {
  padding: 1rem;
  margin: 0;
  list-style: none;
}

.search-list {
  text-align: left;
  display: flex;
  flex-direction: column;
  overflow: auto;
}

.search-list.embedded {
  --search-list-width: min(75vw, 50rem);
  width: var(--search-list-width);
  max-width: var(--search-list-width);
  max-height: calc(100vh - 8rem);
  z-index: var(--layers-search);
  display: none;
  background: var(--color-background-lightest);
  box-shadow: inset -0.2rem -0.2rem 0.2rem grey,
  inset 0.2rem 0.2rem 0.2rem lightgrey;
  position: absolute;
  right: 3.5rem;
  top: 3rem;
}

.search-list.embedded.active {
  display: block;
}

.search-entry {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;
  padding: 1rem;
  color: var(--color-text);

  box-shadow: inset 0.2rem 0.2rem 0.2rem grey,
  inset -0.2rem -0.2rem 0.2rem lightgrey;
}

div.search-entry a.search-card {
  text-decoration: none;
}

div.search-entry.no-results {
  padding: 2rem;
  text-align: center;
  font-weight: bold;
  font-size: x-large;
}


</style>