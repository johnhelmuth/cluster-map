<script setup lang="ts">

import {useContentSearch} from "~/stores/use-content-search";
import {useModalStateStore} from "~/stores/use-modal-state-store";

const route = useRoute();
const router = useRouter();
const {getSearchResults} = await useContentSearch();

const { setCurrentOpenModal, closeModal } = useModalStateStore('searchResultsDropdown', closeResults);

/**
 * isNavigating is a flag used to note when navigating away from a page that
 * has an active search.
 *
 * It is true if the navigation is happening between 2 different paths and
 * the search field is not empty.
 *
 * When the searchQueryParam watcher method triggers,
 * if the isNavigating value is true,
 * the browser history update is skipped,
 * and the isNavigating value is set to false.
 */
let isNavigating = false;

router.beforeEach((to, from) => {
  if (from.path !== to.path && searchQueryParam.value) {
    // Reset the search dropdown component search param, don't re-navigate.
    isNavigating = true;
    searchQueryParam.value = '';
  }
});

const resultsAreActive = ref(false);

const urlQueryParam = route?.query?.search?.toString() || '';
const searchQueryParam = ref(urlQueryParam);
watch(searchQueryParam, () => {
  if (isNavigating) {
    isNavigating = false;
    return;
  }
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

const hasQueryValue = computed(() => !!searchQueryParam.value);

const resultObj = computed(() => getSearchResults(toValue(searchQueryParam), 5));

watch (resultObj, showResults);

function showResults() {
  if (resultObj.value?.results) {
    if (! resultsAreActive.value) {
      openResults();
    }
  } else if (resultsAreActive.value) {
    closeResults();
  }
}

function clearQuery() {
  searchQueryParam.value = '';
  closeResults();
}

function openResults() {
  setCurrentOpenModal();
  resultsAreActive.value = true;
}

function closeResults() {
  resultsAreActive.value = false;
  closeModal();
}

function keyDown(event: KeyboardEvent) {
  const keyName = event.key;
  switch (keyName) {
    case 'Escape':
      clearQuery();
      break;
    case 'Enter':
      if (resultObj.value.results.length) {
        navigateTo({ name: 'search', query: { search: searchQueryParam.value}});
      }
      break;
  }
}

</script>

<template>
  <div class="search-panel" :class="{ 'active': hasQueryValue }">
    <div class="search-form">
      <input type="text"
             v-model="searchQueryParam"
             @keydown="keyDown"
             @focus="showResults"
             placeholder="Search...">
      <Icon id="clear-search-button"
            class="button-icon"
            name="material-symbols:close-small-outline-rounded"
            @click="clearQuery"
      />
    </div>
    <Teleport to="body">
      <Transition name="slide">
        <SearchResults
            :search="searchQueryParam"
            :results="resultObj.results"
            :hasMore="resultObj.more"
            :class="{ 'active': resultsAreActive && hasQueryValue }"
            is-embedded
        />
      </Transition>
    </Teleport>
  </div>

</template>

<style scoped>


@property --search-list-width {
  syntax: "<length>";
  inherits: true;
  initial-value: 60px;
}

.search-panel .search-form {
  display: inline-block;
}
.search-panel .search-form input {
  anchor-name: --search-form-input;
  background-color: var(--color-background-soft);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  border-radius: 0.25rem;
  line-height: 1.5;
  padding: 0.25rem 0.5rem;

  box-shadow:
      inset 0.05rem 0.05rem 0.1rem grey,
      inset -0.05rem -0.05rem 0.1rem lightgrey;
}

.search-panel .button-icon {
  color: var(--color-text);
  height: 1.5rem;
  width: 1.5rem;
  position: relative;
  right: 1.5rem;
  top: .5rem;
  display: inline-block;
  transform: scale(0);
}

.search-panel.active .button-icon {
  transform: scale(1);
}

</style>