<script setup lang="ts">

import type {SystemModelInterface} from "@/types/SystemTypes";
import {computed} from "vue";
import {attributesFormatted, getEnvironmentColor} from "@/data/attributes-meta";
import type {RoutePlanRefType} from "@/types/RoutePlannerTypes";

const props = defineProps< {
  system: SystemModelInterface,
  plan?: RoutePlanRefType,
  /** @property {boolean} flipped - true if the orientation of the map is rotated 90 degrees. */
  flipped?: boolean,
}>();

defineEmits< {
  selected: [system: SystemModelInterface | undefined]
} >();

const radius = 80;
const textHeight = 15;
const ringGap = 6;
const bgDiscGap = 3;

const positionX = computed(() => props?.flipped ? props.system.positionFlipped.x : props.system.position.x);
const positionY = computed(() => props?.flipped ? props.system.positionFlipped.y : props.system.position.y);
const attributes = computed(() => attributesFormatted(props.system.attributes, "short"));
const isSelected = computed(() => props.system.getSelected());

const rings = computed( () => props.system.attributes.technology > 1 ? props.system.attributes.technology : 1);
const bgDiscRadius = computed(() => {
  return radius + (ringGap * (rings.value-1)) + bgDiscGap;
});

const environmentColor = computed(() => getEnvironmentColor(props.system.attributes.environment));

</script>

<template>
  <g id="system.id" :class="{ selected: isSelected}" @click="$emit('selected', system)" >
    <circle class="bgDisc" :cx="positionX" :cy="positionY" :r="bgDiscRadius"></circle>
    <circle v-if="rings > 3" class="ring fourthRing" :cx="positionX" :cy="positionY" :r="radius + (ringGap * 3)"></circle>
    <circle v-if="rings > 2" class="ring thirdRing" :cx="positionX" :cy="positionY" :r="radius + (ringGap * 2)"></circle>
    <circle v-if="rings > 1" class="ring secondRing" :cx="positionX" :cy="positionY" :r="radius + (ringGap)"></circle>
    <circle class="ring firstRing" :cx="positionX" :cy="positionY" :r="radius"></circle>
    <text class="system-name" :x="positionX" :y="positionY - textHeight">{{ system.name }}</text>
    <text class="system-attributes" :x="positionX" :y="positionY + textHeight">{{ attributes }}</text>
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
  font-size: 1.2rem;
  text-anchor: middle;
  dominant-baseline: middle;
}
.selected text.system-name {
  font-size: 1.5rem;
  font-weight: bold;
}
text.system-attributes {
  font-size: .9rem;
}
</style>
