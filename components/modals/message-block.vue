<script setup lang="ts">
</script>

<template>
<div class="message-block">
<slot></slot>
</div>
</template>

<style scoped>

.message-block {
  position: absolute;
  bottom: 0;
  left: 0;
  border: 1px solid var(--color-border);
  border-radius: .5rem;
}
</style>