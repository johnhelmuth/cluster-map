<script setup lang="ts">

import { useAttrs } from 'vue'

import type {AspectData} from "~/types/character/CharacterTypes";

defineOptions({
  inheritAttrs: false
});

const props = defineProps<{
  trackId: string;
  aspect: AspectData
}>();

const emit = defineEmits<{
  useInvoke: [trackId: string]
}>();

const attrs = useAttrs();

const descriptionIsOpen = ref(false);
const iconExpandedName = 'material-symbols:expand-all-rounded'
const iconCollapsedName = 'material-symbols:collapse-all-rounded'

function useInvoke(trackId: string) {
  emit('useInvoke', trackId);
}

const aspectClasses = computed(() => {
  let classes = {};
  if (attrs?.class) {
    (attrs.class as string).split(' ')
        // @ts-ignore
        .forEach((className) => classes[className] = true);
    if (! props.aspect?.name) {
      // @ts-ignore
      classes['is-empty'] = true;

    }
    return classes;
  }
})

function toggleAccordion() {
  descriptionIsOpen.value = !descriptionIsOpen.value;
}
</script>

<template>
  <div class="aspect-container" :class="aspect?.freeInvokes > 0 ? 'has-invokes' : ''">
    <div class="aspect-name value" :class="aspectClasses">{{ aspect?.name || '&nbsp' }}
    </div>
    <div v-if="aspect?.freeInvokes" class="aspect-invokes">
      <StressBox v-for="index in aspect.freeInvokes"
                 class=""
                 :key="index-1"
                 :soak-number="1"
                 :show-soak-amount="false"
                 :is-checked="false"
                 @toggle-box="useInvoke(trackId)"
      />
    </div>
    <Icon v-if="aspect?.description" class="button-icon accordion-button" :name="descriptionIsOpen ? iconExpandedName : iconCollapsedName" @click="toggleAccordion"/>
    <div v-if="aspect?.description" class="aspect-description" :class="descriptionIsOpen ? 'open' : 'closed'" @click="toggleAccordion">
      <MDC class="aspect-description-markdown" :value="aspect.description" />
    </div>
  </div>
</template>

<style scoped>
div.aspect-container {
  display: grid;
  grid-template-columns: 4fr 1fr 1fr;
  grid-auto-rows: min-content;
  grid-template-areas: "name name accordion-icon"
                       "description description description";
  align-items: center;
}
div.aspect-container.has-invokes {
  grid-template-areas: "name invokes accordion-icon"
                       "description description description";
}
.aspect-name {
  font-weight: bold;
  font-style: italic;
  font-size: 1.1rem;
  padding-left: 1rem;
  text-indent: -1rem;
  grid-area: name;
  display: flex;
  justify-content: space-between;
  margin-right: .5rem;
  align-items: center;
}
.aspect-name.value.is-empty {
  border-bottom: 1px solid var(--color-border);
}
.accordion-button {
  grid-area: accordion-icon;
}
.aspect-invokes {
  grid-area: invokes;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 0.35rem;
}
.aspect-invokes :deep(.stress-box-container) {
  width: 1rem;
  height: 1rem;
}
.aspect-description {
  grid-area: description;
  font-size: .9rem;
  font-style: italic;
}
.aspect-description :deep(.aspect-description-markdown p:last-child) {
  margin-bottom: 0;
}

.aspect-description.closed {
  display: none;
}

@media print {
  body.hide-not-to-be-printed .accordion-button {
    display: none;
  }
}
</style>