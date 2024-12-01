<script setup lang="ts">

import type {SystemModelInterface} from "@/types/SystemTypes";
import type {RoutePlanRefType} from "@/types/RoutePlannerTypes";
import {type MapViewStylesType} from "@/types/BasicTypes";

const props = defineProps<{
  system: SystemModelInterface,
  plan?: RoutePlanRefType,
  mapStyle?: MapViewStylesType | undefined,
  shouldRotate: boolean,
}>();

defineEmits< {
  selected: [system: SystemModelInterface | undefined]
} >();

const textHeight = 12;
const ringGap = 5;
const bgDiscGap = 3;

const sysPos = computed(() => {
  const position = props.system.getPosition(props.mapStyle);
  return props.shouldRotate ? rotatePosition(position) : position;
});

const attributes = computed(() => attributesFormatted(props.system.attributes, "short"));
const isSelected = computed(() => props.system.getSelected());

const radius = computed(() => {
  if (props?.mapStyle) {
    return systemRadiusByStyleAndNumberOfSystems(props.mapStyle, props.system.cluster.numSystems);
  }
  return 80;
});

const rings = computed( () => props.system.attributes.technology > 1 ? props.system.attributes.technology : 1);

const bgDiscRadius = computed(() => {
  return radius.value + (ringGap * (rings.value-1)) + bgDiscGap;
});

const environmentColor = computed(() => getEnvironmentColor(props.system.attributes.environment));

</script>

<template>
  <g id="system.id" :class="{ selected: isSelected}" @click="$emit('selected', system)" >
    <circle class="bgDisc" :cx="sysPos.x" :cy="sysPos.y" :r="bgDiscRadius"></circle>
    <circle v-if="rings > 3" class="ring fourthRing" :cx="sysPos.x" :cy="sysPos.y" :r="radius + (ringGap * 3)"></circle>
    <circle v-if="rings > 2" class="ring thirdRing" :cx="sysPos.x" :cy="sysPos.y" :r="radius + (ringGap * 2)"></circle>
    <circle v-if="rings > 1" class="ring secondRing" :cx="sysPos.x" :cy="sysPos.y" :r="radius + (ringGap)"></circle>
    <circle class="ring firstRing" :cx="sysPos.x" :cy="sysPos.y" :r="radius"></circle>
    <text class="system-name"
          :x="sysPos.x"
          :y="sysPos.y - textHeight"
          :textLength="radius*2-(ringGap*4)"
          lengthAdjust="spacingAndGlyphs"
    >
      {{ system.name }}
    </text>
    <text class="system-attributes"
          :x="sysPos.x"
          :y="sysPos.y + textHeight"
    >
      {{ attributes }}
    </text>
  </g>
</template>

<style scoped>
circle {
  fill: var(--color-background-mute);
}

circle.firstRing {
  fill: v-bind('environmentColor');
}

circle.ring {
  stroke: var(--color-highlight);
  stroke-width: 0.2rem;
}
.selected circle.ring {
  stroke: var(--color-action-background);
  stroke-width: 0.3rem;
}
circle.bgDisc {
  stroke: none;
  fill: var(--color-background)
}
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
