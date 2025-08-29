<script setup lang="ts">


import type {SystemModel} from "~/models/SystemModel";

const props = defineProps< {
  system: SystemModel,
  x: number,
  y: number,
  textLength: number,
}>();

const attributes = computed(() => attributesFormatted(props.system.attributes, "short"));

const textHeight = 12;

</script>

<template>
  <g :id="'system-info-' + system.id" class="system-info">
    <text class="system-name"
          :x="x"
          :y="y - textHeight"
          :textLength="textLength"
          lengthAdjust="spacingAndGlyphs"
    >
      {{ system.name }}
    </text>
    <text class="system-attributes"
          :x="x"
          :y="y + textHeight"
          :textLength="textLength"
          lengthAdjust="spacingAndGlyphs"
    >
      {{ attributes }}
    </text>
  </g>
</template>

<style scoped>

text {
  font-size: 1.1rem;
  text-anchor: middle;
  dominant-baseline: middle;
}
.selected text.system-name {
  font-size: 1.1rem;
  font-weight: bold;
}
text.system-attributes {
  font-size: 0.75rem;
}
</style>