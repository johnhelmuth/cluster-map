<script setup lang="ts">

import { VueFinalModal } from 'vue-final-modal'
import { mapViewStyleLabels } from "@/types/BasicTypes";
import {useMapStyles} from "@/utilities/useMapStyles";

const emit = defineEmits<{
  (e: 'close'): void
}>()

const { debug, mapStyle, straightStraits } = useMapStyles();

</script>

<template>
  <VueFinalModal
    class="dynamic-modal"
    content-class="dynamic-modal-content"
    overlay-transition="vfm-fade"
    content-transition="vfm-fade"
  >
    <h1>Cluster Style</h1>
    <div class="content">
      <h2>System Layout</h2>
      <div v-for="styleData in mapViewStyleLabels">
        <label><input type="radio" :value="styleData.key" name="mapStyle" v-model="mapStyle" style="margin-right: 1rem;"/>{{styleData.label}}</label>
      </div>
      <h2>Others</h2>
      <label><input type="checkbox" name="straightStraits" v-model="straightStraits" style="margin-right: 1rem;"/>Straight straits</label>
      <label><input type="checkbox" name="debug" v-model="debug" style="margin-right: 1rem;"/>Enable debug</label>
    </div>
    <button @click="emit('close')">
      Close
    </button>
  </VueFinalModal>
</template>

<style>
.dynamic-modal {
  display: flex;
  justify-content: center;
  align-items: center;
}
.dynamic-modal-content {
  display: flex;
  flex-direction: column;
  padding: .5rem 2rem 1rem;
  background: #fff;
  border-radius: 0.5rem;
}
.dynamic-modal-content > * + *{
  margin: 0.5rem 0;
}
.dynamic-modal-content h1 {
  font-size: 1.375rem;
}
.dynamic-modal-content h2 {
  font-size: 1rem;
  margin-top: 0.5rem;
}
.dynamic-modal-content button {
  margin: 0.25rem 0 0 auto;
  padding: 0 8px;
  //border: 1px solid;
  //border-radius: 5px;
}
.dark .dynamic-modal-content {
  background: #000;
}
.dynamic-modal-content .content {
  display: flex;
  flex-direction: column;
}
</style>
