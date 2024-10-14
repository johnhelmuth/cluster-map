<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <header>
    <img
      alt="Cluster Map logo"
      class="logo"
      src="@/assets/cluster-map-logo.svg"
    />
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/about">About</RouterLink>
    </nav>
  </header>

  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
  display: flex;
  place-items: center;
  /*padding-right: calc(var(--section-gap) / 2);*/
}

.logo {
  /*display: inline;*/
  margin: 0 2rem 0 0;
  height: 2rem;
  width: 2rem;
}

nav {
  /*width: 100%;*/
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
