
<script setup lang="ts">
import { defineProps } from 'vue';

defineProps<{
  viewBox: string
}>();
</script>

<template>
  <svg :viewBox="viewBox" xmlns="http://www.w3.org/2000/svg">
    <filter id="blur1">
      <feGaussianBlur stdDeviation="3" />
    </filter>
    <filter id="blur2">
      <feGaussianBlur stdDeviation="2" />
    </filter>
    <slot name="straits">Default value for Straits</slot>
    <slot name="systems">Default value for Systems</slot>
  </svg>
</template>
