<script setup lang="ts">

import {useBreadCrumbs} from "~/composables/use-bread-crumbs";

const { breadCrumbs } = await useBreadCrumbs();

</script>

<template>
<div v-if="breadCrumbs?.length">
  <ul class="breadcrumb-list">
    <li v-for="(breadcrumb, index) in breadCrumbs" :key="`crumb-${index}`" class="breadcrumb-item">
      <NuxtLink v-if="breadcrumb?.isAPage && index+1 < breadCrumbs.length" :to="breadcrumb.path">
        {{ breadcrumb.name }}
      </NuxtLink>
      <span v-else>{{ breadcrumb.name }}</span>
    </li>
  </ul>
</div>
</template>

<style scoped>
ul {
  list-style: none;
  padding: 0;
}
li::after {
  content: '>';
  margin-left: 0.5rem;
  margin-right: 0.5rem;
}
li:last-child::after {
  content: none;
  margin: revert;
}
li {
  display: inline-block;
}
.breadcrumb-item:last-child, .breadcrumb-item:last-child * {
  font-weight: bold;
}
.breadcrumb-item a {
  font-style: italic;
  color: var(--color-text-lightest);
}
</style>