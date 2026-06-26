<script setup lang="ts">

import {ModalsContainer} from 'vue-final-modal'
import {getCSSPageRules} from "~/utils/utils";

const route = useRoute();

useSeoMeta({
  titleTemplate: (titleChunk) => {
    return titleChunk
        ? (titleChunk !== "In Dire Straits" ? `${titleChunk} - In Dire Straits` : titleChunk)
        : 'In Dire Straits';
  }
});

onMounted(() => {
  // document.querySelector('body')?.style.setProperty('--current-date-time', '"2026-06-24"')
  const pageRules = getCSSPageRules();
  if (pageRules && pageRules.length > 0) {
    const pageRule = pageRules[0];
    console.log('app.onMounted() pageRule', pageRule)
    if (Object.hasOwn(pageRules, "style")) {

    }
  }
})
</script>

<template>
  <div id="app">
    <NuxtRouteAnnouncer/>

    <header>
      <NuxtLink to="/"><Logo/></NuxtLink>
      <SearchDropdown v-if="route.path !== '/search'" />
      <BurgerMenu class="on-right">
        <ThemeSwitch class="theme-switch" />
        <NuxtLink to="/tatterpedia">Tatterpedia</NuxtLink>
        <NuxtLink to="/rules-and-systems">Rules & Systems</NuxtLink>
        <NuxtLink to="/campaigns">Campaigns</NuxtLink>
        <NuxtLink to="/characters">Characters</NuxtLink>
        <NuxtLink to="/aspects">Aspects</NuxtLink>
        <NuxtLink to="/search">Search</NuxtLink>
        <NuxtLink to="/maps">Maps</NuxtLink>
        <NuxtLink to="/clusters">Clusters</NuxtLink>
        <NuxtLink to="/news">Site news</NuxtLink>
        <NuxtLink to="/settings">Settings</NuxtLink>
        <NuxtLink to="/about">About</NuxtLink>
      </BurgerMenu>
    </header>

    <NuxtPage class="content"/>
    <ModalsContainer/>
  </div>
</template>

<style>

header {
  line-height: 1.5;
  max-height: 100vh;
  flex: 0 1 auto;
  display: flex;
  place-items: center;
  justify-content: flex-end;
  text-align: left;
  font-size: 1rem;
  padding: 0.5rem 0;
}

header > * {
  margin-left: 1rem;
}
header :first-child {
  margin-right: auto;
}

.content {
  flex: 1 1 auto;
  container: content / inline-size;
}

footer {
  min-height: 1rem;
}

@media (max-width: 1024px) {
  footer {
    min-height: 1rem;
  }
}

nav {
  text-align: left;
  font-size: 1rem;
  padding: 1rem 0;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

nav .theme-switch {
  margin: 0.5rem 1rem;
}

@media print {
  body.hide-not-to-be-printed #app > header,
  body.hide-not-to-be-printed #app > footer,
  body.hide-not-to-be-printed #app > nav
  {
    display: none;
  }
}
</style>
