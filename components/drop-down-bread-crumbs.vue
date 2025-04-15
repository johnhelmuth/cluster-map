<script setup lang="ts">

import {useBreadCrumbs} from "~/composables/use-bread-crumbs";

const { breadCrumbs } = await useBreadCrumbs();

const props = defineProps<{
  hideIfOnlyOne?: boolean;
}>();

const showBreadCrumbs = computed(() => {
  return !props.hideIfOnlyOne || (breadCrumbs?.value && breadCrumbs.value.length > 1);
})

</script>

<template>
  <div v-if="showBreadCrumbs" class="drop-down-bread-crumbs">
    <div class="drop-down-trigger">...</div>
    <BreadCrumbs class="bread-crumbs"/>
  </div>
</template>

<style scoped>
.drop-down-bread-crumbs {
  position: absolute;
}
.drop-down-trigger {
  font-weight: bold;
  margin-left: 0.5rem;
  cursor: pointer;
  text-align: left;
}
.drop-down-bread-crumbs .bread-crumbs {
  display: none;
  padding: 0.25rem 1rem;

  background-color: var(--color-background);
  border: 1px var(--color-border) solid;
  border-radius: 0.25rem;
  box-shadow: .25rem .25rem .25rem var(--color-text);
}
.drop-down-bread-crumbs:hover .bread-crumbs {
  display: block;
}
</style>