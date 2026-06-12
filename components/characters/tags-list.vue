<script setup lang="ts">

defineProps<{
  "tags": string[],
}>();

</script>

<template>
  <div class="tags-list">
    <div v-for="tag in tags" :key="tag"><NuxtLink :to="{ name: 'characters', query: { tags: tag }}">{{ tag }}</NuxtLink></div>
  </div>
</template>

<style scoped>
div.tags-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: start;
  margin-left: 3rem;
}
div.tags-list > div {
  display: inline;
  margin-left: 1rem;
  border: 1px solid var(--color-border);
  padding: .25rem .5rem;
  background-color: var(--color-background);
}
</style>