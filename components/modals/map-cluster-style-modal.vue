<script setup lang="ts">

import {mapViewStyleLabels, type MapViewStylesType} from "@/types/BasicTypes";
import { VueFinalModal } from 'vue-final-modal'

const props = defineProps<{
  mapStyleParams: { debug: boolean, mapStyle: MapViewStylesType },
}>();

const emit = defineEmits<{
  (e: 'closed'): void,
}>();

</script>

<template>
  <VueFinalModal
    class="dynamic-modal"
    content-class="dynamic-modal-content"
    overlay-transition="vfm-fade"
    content-transition="vfm-fade"
  >
    <h2>Cluster Style</h2>
    <Icon class="close-x" name="material-symbols:close-rounded" @click="emit('closed')"/>
    <div class="content">
      <h3>System Layout</h3>
      <div v-for="styleData in mapViewStyleLabels">
        <label><input type="radio" :value="styleData.key" name="mapStyle" v-model="mapStyleParams.mapStyle"/>{{styleData.label}}</label>
      </div>
      <h3>Others</h3>
      <label><input type="checkbox" name="debug" v-model="mapStyleParams.debug"/>Enable debug</label>
    </div>
  </VueFinalModal>
</template>

<style>
.dynamic-modal {
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: var(--layers-navigation);
}
.dynamic-modal-content {
  display: flex;
  flex-direction: column;
  padding: .5rem 2rem 1rem;
  background: var(--color-background);
  border-radius: 0.5rem;
  width: 20rem;
  contain: layout paint;
  border: 1px solid var(--color-border);
}
.dynamic-modal-content h2 {
  font-size: 1.375rem;
  text-align: center;
}
.dynamic-modal-content .close-x {
  position: absolute;
  height: 1.75rem;
  width: 1.75rem;
  right: 0;
  top: 0;
  margin: 0.4rem;
}
.dynamic-modal-content h3 {
  font-size: 1rem;
  margin-top: 0.75rem;
}

.dark .dynamic-modal-content {
  background: #000;
}
.dynamic-modal-content .content {
  display: flex;
  flex-direction: column;
}
input[type="checkbox"], input[type="radio"] {
  margin-right: 1rem;
}
</style>
