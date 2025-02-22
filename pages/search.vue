<script setup lang="ts">

import {useContentSearch} from "~/stores/use-content-search";

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
    <div class="search-panel">
      <div class="search-form"><input type="text" v-model="searchQueryParam" placeholder="Search..."></div>
      <SearchResults
          :search="searchQueryParam"
          :results="resultsObj.results"
      />
    </div>
  </InfoPage>

</template>

<style scoped>

.search-form {
  padding: 2rem;
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