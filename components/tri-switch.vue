<script setup lang="ts">

export type TriSwitchPositionType = 'left' | 'center' | 'right';

const switchPos = defineModel<TriSwitchPositionType>({default: 'left'});

const stateEnum = ['left', 'center', 'right'] as Array<TriSwitchPositionType>;

const switchState = ref(stateEnum.indexOf(switchPos.value || 'left'));

function toggleSwitch(event: Event) {
  switchState.value = (switchState.value + 1) % 3;
  switchPos.value = stateEnum[switchState.value];
  event.stopPropagation(); // Widget's state change shouldn't be noticed by things other than via the model reactivity.
}
</script>

<template>
  <div class="tri-switcher" :class="switchPos" @click="toggleSwitch">
    <div class="tri-switch-thumb">
    </div>
  </div>
</template>

<style scoped>
.tri-switcher {
  --widget-height: 1.5rem;
  --widget-width: calc(var(--widget-height) * 2);
  --thumb-margin: calc(var(--widget-height) * 0.125);
  --thumb-size: calc(var(--widget-height) - var(--thumb-margin) * 2);
  --border-width: 0.0125rem;
  --shadow-position-pos: 0.125rem;
  --shadow-position-neg: calc(-1 * var(--shadow-position-pos));

  background-color: var(--color-background);
  border-radius: calc(var(--widget-height) / 2);
  border: var(--border-width) solid var(--color-border);
  width: var(--widget-width);
  height: var(--widget-height);
  display: flex;
  padding: var(--thumb-margin);
  align-items: center;
  box-shadow: var(--thumb-margin) var(--thumb-margin) var(--thumb-margin) grey inset,
  calc(-1 * var(--thumb-margin)) calc(-1 * var(--thumb-margin)) var(--thumb-margin) lightgrey inset;
}

.left {
  justify-content: flex-start;
}

.center {
  justify-content: center;
}

.right {
  justify-content: flex-end;
}

.tri-switcher .tri-switch-thumb {
  background: radial-gradient( lightgrey 0, darkgrey 100%);
  width: var(--thumb-size);
  height: var(--thumb-size);
  border-radius: calc(var(--thumb-size) / 2);
  margin: 0;
}
</style>