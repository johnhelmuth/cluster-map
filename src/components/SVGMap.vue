
<script setup lang="ts">
import { defineProps } from 'vue';

defineProps<{
  viewBox: string
}>();
</script>

<template>
  <svg :viewBox="viewBox" xmlns="http://www.w3.org/2000/svg">
    <slot name="straits">Default value for Straits</slot>
    <slot name="systems">Default value for Systems</slot>
  </svg>
</template>
