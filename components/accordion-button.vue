<script setup lang="ts">

const props = defineProps<{
  targetElement: string,
  startAccordionOpen?: boolean
}>();

const descriptionIsOpen = ref(!!props?.startAccordionOpen);
const iconExpandedName = 'material-symbols:expand-all-rounded'
const iconCollapsedName = 'material-symbols:collapse-all-rounded'

function toggleAccordion() {
  descriptionIsOpen.value = !descriptionIsOpen.value;
  updateParagraphState()
}

function updateParagraphState() {
  if (paraEl.value) {
    if (descriptionIsOpen.value) {
      paraEl.value.style = 'reset';
    } else {
      paraEl.value.style.display = 'none';
    }
  }
}
const paraEl = computed(() => {
  if (props.targetElement) {
    const el = document.querySelector(props.targetElement);
    if (el) {
      return el as HTMLElement;
    }
  }
});

onMounted(() => {
  updateParagraphState();
})

</script>

<template>
  <div>
    <Icon class="button-icon accordion-button"
          :name="descriptionIsOpen ? iconExpandedName : iconCollapsedName" @click="toggleAccordion"/>
  </div>
</template>

<style scoped>

</style>