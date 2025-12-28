<script setup lang="ts">

import {ModalsContainer} from 'vue-final-modal'

import { useUniversesStore } from "~/stores/use-universes-store";

const router = useRouter();
const route = useRoute();

const universesStore = useUniversesStore();

onMounted(async () => {
  await universesStore.initUniverses();
  await universesStore.initDefaultUniverse();
})
</script>

<template>
  <div id="app">
    <NuxtRouteAnnouncer/>

    <header>
      <NuxtLink to="/"><Logo/></NuxtLink>
      <SearchDropdown v-if="route.path !== '/search'" />
      <UserProfileMenu>
        <NuxtLink to="/me">Profile page</NuxtLink>
        <NuxtLink to="/logout">Log out</NuxtLink>
      </UserProfileMenu>
      <BurgerMenu class="on-right">
        <ThemeSwitch class="theme-switch" />
        <NuxtLink to="/tatterpedia">Tatterpedia</NuxtLink>
        <NuxtLink to="/sessions">Sessions</NuxtLink>
        <NuxtLink to="/rules-and-systems">Rules & Systems</NuxtLink>
        <NuxtLink to="/search">Search</NuxtLink>
        <NuxtLink to="/maps">Maps</NuxtLink>
        <NuxtLink to="/universe">Current universe</NuxtLink>
        <NuxtLink to="/universes">Universes</NuxtLink>
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

</style>
