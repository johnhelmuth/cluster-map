
<script setup lang="ts">

const props = defineProps<{
  viewBox: string
}>();

</script>

<template>
  <svg :viewBox="viewBox" xmlns="http://www.w3.org/2000/svg">
    <slot name="background"></slot>
    <slot name="cluster-straits">Default value for Cluster Straits</slot>
    <slot name="straits">Default value for Straits</slot>
    <slot name="systems">Default value for Systems</slot>
    <slot name="default"></slot>
  </svg>
</template>
