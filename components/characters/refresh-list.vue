<script setup lang="ts">

const props = defineProps<{
  "refresh": number,
  "fatePoints": number
}>();
</script>

<template>
  <ul>
    <li class="property-item">
      <div class="list-label refresh-label">Refresh</div>
      <div class="refresh-value value">{{ refresh }}</div>
    </li>
    <li class="property-item">
      <div class="list-label fate-points-label">Fate Points</div>
      <div class="fate-points-value value">{{ fatePoints }}</div>
    </li>
  </ul>

</template>

<style scoped>

li.property-item {
  align-items: center;
  column-gap: 0.75rem;
}

ul .list-label {
  line-height: 1;
}

.value {
  font-size: 2rem;
}

</style>