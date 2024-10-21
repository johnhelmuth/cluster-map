<script setup lang="ts">

import type {AspectType} from "@/types/BasicTypes";

defineProps< {
  aspects?: Array<AspectType>
}>();
</script>

<template>
  <div class="system-aspects">
    <div class="system-aspect" v-for="aspect in aspects || []">
      {{ aspect }}
    </div>
  </div>
</template>

<style scoped>

.system-aspects {
  margin-bottom: 0.5rem;
}
.system-aspect {
  line-height: 1.3;
  font-weight: bold;
  font-style: italic;
  margin: 0.5rem auto;
}
</style>
