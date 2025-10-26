<script setup lang="ts">

const props = defineProps<{
  page_title: string,
  maxWidthRems?: string,
  includeFooter?: boolean,
}>();

const realMaxWidth = computed(() => {
  if (!!props.maxWidthRems) {
    return `${props.maxWidthRems}rem`;
  } else {
    return "80rem";
  }
});

</script>

<template>
  <Bezels>
    <template v-slot:controls>
      <div class="info-panel">
        <div class="info-box">
          <h1>
            <DropDownBreadCrumbs hide-if-only-one />
            {{ page_title }}
          </h1>
          <div :class='{"info-content": true}'>
            <slot>Default page contents</slot>
          </div>
          <InfoFooter v-if="includeFooter"/>
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
  container-type: inline-size;
  flex: 0 1 auto;
  width: 100%;
  max-width: v-bind('realMaxWidth');
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}

h1 {
  text-align: center;
  flex: 0 1 auto;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.info-content {
  overflow-y: auto;
  flex: 2 1 auto;
  background-color: var(--color-background-soft);
  border-radius: 0.5rem;
  border: .25px solid var(--color-background-lightest);
  box-shadow: inset -0.125rem -0.125rem 0.125rem lightgrey,
  inset 0.125rem 0.125rem 0.125rem #777;
  padding: 1rem;
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

.info-content :deep(ul) {
  margin-bottom: 1rem;
}

.info-content :deep(table), .info-content :deep(table tr td), .info-content :deep(table tr th) {
  border-collapse: collapse;
  border: 1px solid var(--color-border);
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
  color: var(--color-text);
  font-style: italic;
  padding: 1rem;
  border-radius: 0.75rem;
}

.info-content :deep(> div) {
  flex-basis: 90%;
}

.info-content :deep(em) {
  font-style: italic;
}

.info-content :deep(strong) {
  font-weight: bolder;
}
</style>