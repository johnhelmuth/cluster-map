<script setup lang="ts">

import {RouterLink, RouterView} from 'vue-router'
import LogoIcon from './components/icons/LogoIcon.vue'

</script>

<template>
  <header>
    <RouterLink to="/"><LogoIcon/></RouterLink>
    <nav>
      <RouterLink to="/map">Map</RouterLink>
      <RouterLink to="/clusters" >Clusters</RouterLink>
      <RouterLink to="/about">About</RouterLink>
      <RouterLink to="/settings">Settings</RouterLink>
    </nav>
  </header>

  <RouterView class="content"/>
  <footer></footer>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
  flex: 0 1 auto;
  display: flex;
  place-items: center;
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

</style>
