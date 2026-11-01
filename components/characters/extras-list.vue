<script setup lang="ts">

import type {ExtraData, TrackData} from "~/types/character/CharacterTypes";

const props = defineProps<{
  extras: Array<ExtraData>
}>();

</script>

<template>
  <div v-if="extras?.length > 0" class="extras-block">
    <div v-for="(extra, index) in extras" :key="index" class="extra" :data-extra-index="index">
      <h3 v-if="extra.name">{{ extra.name }}<span class="anchor"></span></h3>
      <AccordionButton v-if="extra?.description"
                       class="description-accordion-button"
                       :target-element="`.extra-description-${index}-container`"
      />
      <div v-if="extra?.description"
           class="extra-description"
           :class="`extra-description-${index}-container`"
      >
        <MDC :value="extra?.description" class="extra-description-markdown"/>
      </div>
      <div v-if="extra.elements" class="extra-elements">
        <template v-for="extraEl in extra.elements" class="extra-element" :class="`extra-type-${extraEl.extraType}`">
          <TrackList v-if="extraEl.extraType === 'track'" :tracks="[extraEl as TrackData]" title=""/>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>

.extras-block {
  display: grid;
  grid-template-columns: minmax(min-content, 5fr);
  gap: 0.75rem;
  justify-content: start;
  border-top: 1px solid var(--color-border);
  padding-top: 1rem;
  margin-top: 1rem;

  div.extra {
    padding: 1px;
    grid-column: 1 / -1;
    display: grid;
    grid-template-columns: subgrid;

    h3 {
      grid-column: 1 / -1;
    }

    h3 span.anchor {
      anchor-name: --extra-name;
    }

    .description-accordion-button {
      position: absolute;
      position-anchor: --extra-name;
      top: anchor(top);
      left: calc(anchor(right) + 1rem);
    }

    .extra-description {
      font-size: .9rem;
      font-style: italic;
      padding-left: 3rem;
    }

    div.extra-elements {
      padding: 1px;
      grid-column: 1 / -1;
      display: grid;
      grid-template-columns: subgrid;
      row-gap: 1rem;
    }
  }
}

</style>