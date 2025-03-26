<script setup lang="ts">

const props = defineProps<{
  isChecked: boolean;
  showSoakAmount?: boolean;
  soakNumber?: number
}>();

const emit = defineEmits(["toggleBox"]);

function toggleStressBox() {
  emit('toggleBox');
}

const shouldShowSoak = computed(() => {
  return (typeof props?.showSoakAmount === 'boolean' ? props.showSoakAmount : true);
});

</script>

<template>
  <div class="stress-box-container" @click="toggleStressBox" :class="{ checked: isChecked}">
    <div v-if="shouldShowSoak" class="soak-value">{{ soakNumber }}</div>
  </div>
</template>

<style scoped>

.stress-box-container {
  border: 2px solid var(--color-text);
  border-radius: 3px;
  font-size: 2.1rem;
  width: 2rem;
  height: 2rem;
}
.stress-box-container.checked {
  background-color: var(--color-text);
  color: var(--color-background)
}

.soak-value {
  text-align: center;
  font-size: 1.2rem;
}
</style>