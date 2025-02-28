<template>
  <div>
    <div class="bezel" :class="(! $slots.controls || ! $slots.display) ? 'full-width' : ''">
      <div v-if="$slots.display" class="bezel-panel display-slot">
        <slot name="display">Default value for Display</slot>
      </div>
      <div v-if="$slots.controls" class="bezel-panel controls-slot">
        <slot name="controls"></slot>
      </div>
    </div>
  </div>

</template>


<style scoped>

.bezel {
  /*
   * These numbers are just fudged until I got tired of trying combinations; they are good enough for now.
   */
  --bezel-bottom-border: max(4.5rem, 6cqw);
  --bezel-height: calc(100cqh - var(--bezel-bottom-border));
  border-radius: 0.5rem;
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 0;
}

@media (max-width: 1024px) {
  .bezel {
    border-radius: 0.25rem;
  }
}
@media (min-width: 2500px) {
  .bezel {
    grid-template-columns: 5fr 1fr;
  }
}
.bezel.full-width {
  grid-template-columns: 4fr;
}

.bezel-panel {
  border-radius: 0.5rem;
  height: var(--bezel-height);
}

@media (max-width: 1024px) {
  .bezel-panel {
    border-radius: 0.25rem;
  }
}

.bezel-panel.display-slot {
  padding: 0.5rem;
  box-shadow:
      inset -0.25rem -0.25rem 0.25rem #777,
      inset  0.25rem  0.25rem 0.25rem lightgrey;
  background-color: var(--vt-c-black-mute);
  border-radius: 0.5rem;
}

.bezel-panel.controls-slot {
  border-radius: unset;
}

</style>
