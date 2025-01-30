<script setup lang="ts">

import type {Toc} from "@nuxtjs/mdc";

const route = useRoute();

const props = defineProps<{
  isExpanded: boolean,
  toc: Toc | undefined
}>();

const emit = defineEmits<{
  "toggle-toc": [];
}>();

const tocIconName = 'material-symbols:toc-rounded';

function toggleToc() {
  emit('toggle-toc');
}

/**
 * Handle the scroll behavior when an item on the table of contents
 * menu is clicked.
 *
 * @param e
 */
function tocItemClicked(e) {
  const href = e.currentTarget.href;
  const hashElement = document.querySelector(href);
  if (hashElement) {
    hashElement.scrollIntoView({behavior: 'smooth'});
  }
  toggleToc();
}

onMounted(() => {
  console.log('TableOfContents.onMounted() props.toc: ', props.toc);
  console.log('TableOfContents.onMounted() route.path: ', route.path);
})
</script>

<template>
  <div :class='{"table-of-contents-container": true, "is-expanded": isExpanded}'>
    <Icon class="expand-toc" @click="toggleToc"
          :name="tocIconName"/>
    <ul class="table-of-contents" v-show="isExpanded">
      <li><NuxtLink v-if="route.path !== '/tatterpedia'" to="/tatterpedia"><strong>Back to home</strong></NuxtLink></li>
      <li v-if="toc?.links?.length > 1" v-for="link of toc?.links">
        <a :href="'#' + link.id">{{ link.text }}</a>
        <ul class="table-of-contents-2" v-if="link.children">
          <li v-for="childLink of link.children">
            <a :href="'#' + childLink.id" @click="tocItemClicked">{{ childLink.text}}</a>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<style scoped>

.table-of-contents-container {
  display: flex;
  flex-direction: column;
  border: 1px solid transparent;
}
.table-of-contents-container .table-of-contents {
  display: none;
  background-color: var(--color-background-inverted-mute);
  border: 1px solid var(--color-border-inverted);
}

.table-of-contents-container .table-of-contents {
  padding-left: 1.25rem;
}

.expand-toc {
  font-size: 2.5em;
  font-weight: bolder;
  align-self: flex-end;

}

/* TODO: Add animation to slide the table of contents into view. */
.table-of-contents-container.is-expanded .table-of-contents {
  display: block;
}
</style>