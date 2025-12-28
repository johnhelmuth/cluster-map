<script setup lang="ts">

import type {SystemModel} from "@/models/SystemModel";
import {type MapViewStylesType} from "@/types/MapViewTypes";
import type {RoutePlanRefType} from "~/utils/route-planner";

const props = defineProps<{
  system: SystemModel,
  plan?: RoutePlanRefType,
  mapStyle?: MapViewStylesType | undefined,
  shouldRotate: boolean,
}>();

defineEmits<{
  selected: [system: SystemModel | undefined]
}>();

const showInfoInside = computed(() => {
  return props.mapStyle !== 'linear';
})
const ringGap = 5;
const bgDiscGap = 3;

const sysPos = computed(() => {
  return props.system.getPosition(props.mapStyle, props.shouldRotate);
});

const isSelected = computed(() => props.system.getSelected());

const radius = computed(() => {
  if (props?.mapStyle) {
    return systemRadiusByStyleAndNumberOfSystems(props.mapStyle, props.system.cluster.numSystems);
  }
  return 80;
});

const maxStraitRadius = computed(() => {
  if (props?.mapStyle && props?.system) {
    const direction = props?.shouldRotate ? 'right' : 'left';
    return Math.max(props.system.cluster.maxStraitRadius(props.mapStyle, radius.value, direction) * 0.40, radius.value);
  }
  return 80;
});

const rings = computed(() => props.system.attributes.technology > 1 ? props.system.attributes.technology : 1);

const bgDiscRadius = computed(() => {
  return radius.value + (ringGap * (rings.value - 1)) + bgDiscGap;
});

const environmentColor = computed(() => getEnvironmentColor(props.system.attributes.environment));

</script>

<template>
  <g :id="'system-' + system.id" :class="{ selected: isSelected}" @click="$emit('selected', system)">
    <circle class="bgDisc" :cx="sysPos.x" :cy="sysPos.y" :r="bgDiscRadius"></circle>
    <circle v-if="rings > 3" class="ring fourthRing" :cx="sysPos.x" :cy="sysPos.y" :r="radius + (ringGap * 3)"></circle>
    <circle v-if="rings > 2" class="ring thirdRing" :cx="sysPos.x" :cy="sysPos.y" :r="radius + (ringGap * 2)"></circle>
    <circle v-if="rings > 1" class="ring secondRing" :cx="sysPos.x" :cy="sysPos.y" :r="radius + (ringGap)"></circle>
    <circle class="ring firstRing" :cx="sysPos.x" :cy="sysPos.y" :r="radius"></circle>
    <SystemInfoGraph v-if="showInfoInside" :system="system" :x="sysPos.x" :y="sysPos.y"
                     :textLength="radius*2-(ringGap*4)"/>
    <SystemInfoPlateGraph
        v-else
        :should-rotate="shouldRotate"
        :system="system" :x="sysPos.x"
        :y="sysPos.y"
        :radius="radius"
        :maxStraitRadius="maxStraitRadius"
        :textLength="radius*2-(ringGap*4)"
    />
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
</style>
