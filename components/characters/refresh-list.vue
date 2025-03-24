<script setup lang="ts">

const props = defineProps<{
  "refresh": number,
  "fatePoints": number
}>();
</script>

<template>
  <div>
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
  </div>

</template>

<style scoped>

li.property-item {
  align-items: center;
}

ul .list-label {
  line-height: 1;
}

.value {
  font-size: 2rem;
}

</style>