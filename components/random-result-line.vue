<script setup lang="ts">

import type {ResultsLine} from '@/types/RandomTableTypes'

defineProps<{
  line: ResultsLine
}>();

</script>

<template>
  <span>{{ line.timestamp }}</span> <span>{{ line.selectedIndex }}</span> <span>{{ line?.choice?.value }}</span>
</template>

<style scoped>

</style>