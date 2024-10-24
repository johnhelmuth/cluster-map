<script setup lang="ts">

import BezelLayout from "./BezelLayout.vue";
import InfoFooter from "@/components/InfoFooter.vue";
import {computed} from "vue";

const props = defineProps<{ page_title: string, maxWidthRems?: string }>();

const realMaxWidth = computed(() => {
  if (typeof props.maxWidthRems === "string" && !! props.maxWidthRems) {
    return `${props.maxWidthRems}rem`;
  } else {
    return "80rem";
  }
});

</script>

<template>
  <BezelLayout>
    <template v-slot:controls >
      <div class="info-panel">
        <div class="info-box">
          <h1>{{ page_title }}</h1>
          <div class="content">
            <slot name="page_contents">Default page contents</slot>
          </div>
          <InfoFooter/>
        </div>
      </div>
    </template>
  </BezelLayout>
</template>

<style scoped>

.info-panel {
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.info-box {
  flex: 0 1 auto;
  max-height: 75cqh;
  margin: 1rem;
  width: 100%;
  max-width: v-bind('realMaxWidth');
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  padding: 2rem;
  padding-bottom: 1rem;
  background-color: var(--color-background-soft);
  border-radius: 1rem;
  border: .25px solid var(--color-background-lightest);
  box-shadow: inset -0.25rem -0.25rem 0.25rem #777,
  inset  0.25rem  0.25rem 0.25rem lightgrey;
}

h1 {
  text-align: center;
  flex: 0 1 auto;
  font-weight: bold;
}

.content {
  overflow-y: scroll;
  flex: 2 1 auto;
}
</style>
