<script setup lang="ts">

import {useContentSearch} from "~/stores/use-content-search";
import {onBeforeRouteUpdate} from "#vue-router";

const route = useRoute();
const router = useRouter();
const {getSearchResults} = await useContentSearch();

const urlQueryParam = route?.query?.search?.toString() || '';
const searchQueryParam = ref(urlQueryParam);

const resultsObj = computed(() => getSearchResults(toValue(searchQueryParam)));

watch(searchQueryParam, (newQuery) => {
  const newRoute: {name: string, query?: { search: string }} = {
    name: route?.slug,
    query: undefined,
  }
  if (searchQueryParam.value) {
    newRoute.query = {
      search: searchQueryParam.value.toString(),
    };
  }
  router.push(newRoute)
});

</script>

<template>
  <InfoPage page_title="Search">
    <div class="search-form"><input type="text" v-model="searchQueryParam" placeholder="Search..."></div>
    <SearchResults
        :search="searchQueryParam"
        :results="resultsObj.results"
    />
  </InfoPage>

</template>

<style scoped>

.search-form {
  padding-top: 1rem;
  padding-bottom: 1rem;
}

.search-form input {
  background-color: var(--color-background);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  border-radius: 0.25rem;
  line-height: 1.5;
  padding: 0.25rem 0.5rem;
  box-shadow:
      inset 0.05rem 0.05rem 0.1rem grey,
      inset -0.05rem -0.05rem 0.1rem lightgrey;
}

ul:has(.search-entry) {
  padding: 0;
  margin: 0;
}

li:has(.search-entry) {
  list-style-type: none;
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
}

</style>