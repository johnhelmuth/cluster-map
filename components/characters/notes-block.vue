<script setup lang="ts">
defineProps<{
  notes: Array<string>,
}>();
</script>

<template>
  <div>
    <h3>Notes</h3>
    <MDC :value="notes.join('\n')"/>
  </div>
</template>

<style scoped>

div {
  margin: 1rem;
}
div ul, :deep(div ul) {
  list-style: revert;
}
</style>