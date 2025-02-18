<script setup lang="ts">

import MogriAttack from "@/components/vignettes/molgri-attack.vue";

const route = useRoute();

onMounted(() => {
  console.log('vignettes/[...slug] route.params.slug[0]: ', route.params.slug[0]);
  console.log('vignettes/[...slug] vignetteComponent: ', vignetteComponent);
});

const vignettes = new Map([
  ['molgri-attack', MogriAttack],
]);

const vignetteComponent = computed(() => {
  if (vignettes.has(route.params.slug[0])) {
    return vignettes.get(route.params.slug[0]);
  }
});

</script>

<template>

  <InfoPage content-style="video">
    <div class="vignette-container">
      <component :is="vignetteComponent"/>
    </div>
  </InfoPage>

</template>

<style scoped>

.vignette-container {
  container-type: normal;
  width: 100%;
  height: 100%;
}
</style>