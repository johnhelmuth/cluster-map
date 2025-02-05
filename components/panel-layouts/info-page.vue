<script setup lang="ts">

const props = defineProps<{
  page_title: string,
  maxWidthRems?: string,
  useInnerInset?: boolean,
  sidepanelOverlay?: boolean,
  sidepanelExpanded?: boolean,
  sidepanelWidthRems?: string,
}>();

const realMaxWidth = computed(() => {
  if (!! props.maxWidthRems) {
    return `${props.maxWidthRems}rem`;
  } else {
    return "80rem";
  }
});

const realSidepanelWidth = computed(() => {
  if (!! props.sidepanelWidthRems) {
    return `${props.sidepanelWidthRems}rem`;
  } else {
    return "25rem";
  }
});

onMounted(() => {
  console.log('InfoPage onMounted() props.sidepanelExpanded: ', props.sidepanelExpanded);
});

</script>

<template>
  <Bezels>
    <template v-slot:controls >
      <div class="info-panel">
        <div class="info-box">
          <h1>{{ page_title }}</h1>
          <div :class='{"info-content": true, "inset-shadow": useInnerInset}'>
            <slot>Default page contents</slot>
            <div v-if="$slots.sidepanel" :class='{ "info-sidepanel-container": true, "sidepanel-overlay": sidepanelOverlay, "sidepanel-expanded": sidepanelExpanded }'>
              <slot name="sidepanel"></slot>
            </div>
          </div>
          <InfoFooter/>
        </div>
      </div>
    </template>
  </Bezels>
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
  width: 100%;
  max-width: v-bind('realMaxWidth');
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  padding: 1rem 1.5rem .25rem;

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
  margin-bottom: 0.5rem;
}

.info-content {
  overflow-y: scroll;
  flex: 2 1 auto;
  display: flex;
  flex-direction: row;
}


.info-content.inset-shadow {
  border-radius: 0.5rem;
  border: .25px solid var(--color-background-lightest);
  box-shadow: inset -0.25rem -0.25rem 0.25rem lightgrey,
  inset 0.25rem  0.25rem 0.25rem #777;
  padding: 1rem;
  background-color: var(--color-background-inverted);
  color: var(--color-text-inverted);
}

.info-content h1, .info-content h2, .info-content h3, .info-content h4, .info-content h5, .info-content h6 {
  font-weight: bolder;
}
.info-content :deep(h1),
.info-content :deep(h2),
.info-content :deep(h3),
.info-content :deep(h4),
.info-content :deep(h5),
.info-content :deep(h6) {
  font-weight: bolder;
  margin-bottom: 0.5rem;
}

.info-content :deep(a) {
  font-weight: bolder;
  text-decoration: underline;
}
.info-content :deep(p) {
  margin-bottom: 1rem;
}
.info-content.inset-shadow :deep(a) {
  color: var(--color-action-text-inverted);
}

.info-content.inset-shadow :deep(hr) {
  border-color: var(--color-border-inverted);
}
.info-content :deep(table), .info-content :deep(table tr td), .info-content :deep(table tr th) {
  border-collapse: collapse;
  border: 1px solid var(--color-border);
}

.info-content.inset-shadow :deep(table),
.info-content.inset-shadow :deep(table tr td),
.info-content.inset-shadow :deep(table tr th) {
  border: 1px solid var(--color-border-inverted);
}

.info-content :deep(table) {
  margin: 1rem 0;
}

.info-content :deep(table tr td), .info-content :deep(table tr th) {
  padding: 0.25rem 0.5rem;
}

.info-content :deep(blockquote) {
  margin-left: 2rem;
  margin-right: 2rem;
  background-color: var(--color-background-lightest);
  color: var(--color-text-inverted-lightest);
  font-style: italic;
  padding: 1rem;
  border-radius: 0.75rem;
}

.info-content :deep(> div) {
  flex-basis: 90%;
}

.info-content .info-sidepanel-container {
  flex-basis: 20%;
  width: v-bind('realSidepanelWidth');
}

.info-content .info-sidepanel-container.sidepanel-overlay {
  position: sticky;
  inset: 0;
}
</style>