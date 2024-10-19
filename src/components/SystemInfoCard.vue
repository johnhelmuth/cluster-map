<script setup lang="ts">

  import type SystemModelInterface from "@/models/SystemModel";
  import SystemAttributes from "@/components/SystemAttributes.vue";
  import SystemAspects from "@/components/SystemAspects.vue";

  defineProps< {
    system: SystemModelInterface
  }>();

  // TODO: make these composable functions?
  function toggleAccordion(e) {
    const container = e.currentTarget;
    container.classList.toggle('open');
    const accordionBodies = container.querySelectorAll('.accordion');
    if (accordionBodies.length) {
      accordionBodies.forEach(accordion => accordion.classList.toggle('open'));
    }
  }

</script>

<template>
  <div class="system-info-card accordion-control" @click="toggleAccordion">
    <h2>{{ system.name }}</h2>
    <div class="system-info accordion">
      <SystemAttributes :attributes="system.attributes" />
      <SystemAspects :aspects="system.aspects" />
    </div>
  </div>
</template>

<style scoped>

h2 {
  font-size: 1.5rem;
}

.accordion {
  display: none;
}

.accordion.open {
  display: block;
}

.system-info-card {
  border-radius: 5px;
  background-color: rgba(255,255,255, 90%);
  box-shadow: inset -0.1rem -0.1rem 0.1rem grey,
              inset  0.1rem   0.1rem 0.1rem lightgrey;
  margin: 0.5rem 0;
  padding: 0.5rem;
}


</style>
