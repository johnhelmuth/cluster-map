<script setup lang="ts">

const props = defineProps<{
  "name": string,
  "description"?: string
}>();
</script>

<template>
  <div>
    <h2>{{ name }}</h2>
    <div v-if="description">
      <p>{{ description }}</p>
    </div>
  </div>
</template>

<style scoped>

</style>