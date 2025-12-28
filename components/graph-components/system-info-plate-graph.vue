<script setup lang="ts">


import type {SystemModel} from "~/models/SystemModel";

const props = defineProps< {
  system: SystemModel,
  radius: number,
  maxStraitRadius: number,
  x: number,
  y: number,
  textLength: number,
  shouldRotate: boolean,
}>();

const attributes = computed(() => attributesFormatted(props.system.attributes, "short"));

const textHeight = 12;
const gapFromSystemCircle = 20;

const plateParams = computed(() => {
  let x, y, width, height, cx, cy;
  width = (props.radius) * 2 + gapFromSystemCircle;
  height = textHeight * 6;
  if (! props.shouldRotate) {
    cx = props.x;
    cy = props.y - (props.maxStraitRadius + gapFromSystemCircle) * 2;
  } else {
    cx = props.x - (props.maxStraitRadius + gapFromSystemCircle) * 2;
    cy = props.y;
  }
  x = cx - width/2;
  y = cy - height/2;
  return {x, y, width, height, cx, cy};
});

const nameParams = computed(() => {
  let x, y;
  x = plateParams.value.cx;
  y = plateParams.value.cy - textHeight;
  return {x, y};
});

const attrParams = computed(() => {
  let x, y;
  x = plateParams.value.cx;
  y = plateParams.value.cy + textHeight * 1.25;
  return {x, y};
});

</script>

<template>
  <g :id="'system-info-' + system.id">
    <rect
        :x="plateParams.x"
        :y="plateParams.y"
        :width="plateParams.width"
        :height="plateParams.height"
        rx="5"
        class="system-info plate"
    />
    <text class="system-name"
          :x="nameParams.x"
          :y="nameParams.y"
          :textLength="plateParams.width - 15"
          lengthAdjust="spacingAndGlyphs"
    >
      {{ system.name }}
    </text>
    <text class="system-attributes"
          :x="attrParams.x"
          :y="attrParams.y"
          :textLength="plateParams.width - 15"
          lengthAdjust="spacingAndGlyphs"
    >
      {{ attributes }}
    </text>
  </g>
</template>

<style scoped>
.system-info.plate {
  fill: var(--color-text);
  fill-opacity: 0.65;
  stroke: var(--color-border);
  stroke-width: 5px;
}
text {
  font-size: 1.1rem;
  text-anchor: middle;
  fill: var(--color-background);
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