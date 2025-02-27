<script setup lang="ts">

import type {Toc, TocLink} from "@nuxtjs/mdc";
import {useModalStateStore} from "~/stores/use-modal-state-store";

const route = useRoute();
const router = useRouter();

const { setCurrentOpenModal, closeModal } = useModalStateStore('tableOfContentsMenu', toggleToc);

const props = defineProps<{
  toc: Toc | undefined
  extraNavLinks?: { pre: Array<{ text: string, 'handler-tag': string }> } | undefined
}>();

const tocIconName = 'material-symbols:toc-rounded';

const isExpanded=ref(false);

function toggleToc() {
  isExpanded.value = !isExpanded.value;
  if (isExpanded.value) {
    setCurrentOpenModal();
  } else {
    closeModal();
  }
}

/**
 * Handle the scroll behavior when an item on the table of contents
 * menu is clicked.
 *
 * @param e
 */
function tocItemClicked(e: Event) {
  const target = e.currentTarget;
  if (target instanceof HTMLAnchorElement && target.href) {
    scrollToHeader(target.href);
  }
  toggleToc();
}

function scrollToHeader(href: string) {
  const hashElement = document.querySelector(href);
  if (hashElement) {
    hashElement.scrollIntoView({behavior: 'smooth'});
  }
}

function handleExtraNavPreLink(preLink: { text: string, 'handler-tag': string }, fromList: TocLink[]): void {
  // TODO: Move this into something isolated from this component (a composable? a nuxt module?) to handle this behavior
  //       and allow other components to use this, and to define, load, and handle plugins to other types of extra links.
  switch (preLink['handler-tag']) {
    case 'pick-random':
      const linkTo = pickRandomFromList(fromList);
      if (linkTo?.id) {
        const linkToUri = `#${linkTo.id}`;
        router.push(linkToUri);
        scrollToHeader(linkToUri)
      }
      break;
  }
}

function pickRandomFromList(fromList: TocLink[]): TocLink | undefined {
  if (fromList?.length > 0) {
    // TODO Write utility function to return a random element from an array.
    const randomItemIdx = Math.floor(Math.random() * fromList.length);
    if (fromList[randomItemIdx]) {
      return fromList[randomItemIdx];
    }
  }
}

</script>

<template>
  <div :class='{"table-of-contents-container": true, "is-expanded": isExpanded}'>
    <ul class="table-of-contents" v-show="isExpanded">
      <li><NuxtLink v-if="route.path !== '/tatterpedia'" to="/tatterpedia"><strong>Back to home</strong></NuxtLink></li>
      <li v-if="extraNavLinks?.pre?.length" v-for="preLink of extraNavLinks?.pre">
        <a @click.stop="handleExtraNavPreLink(preLink, (toc?.links || []))"><strong>{{ preLink.text}}</strong></a>
      </li>
      <li v-if="(toc?.links?.length || 0) > 1" v-for="link of toc?.links">
        <a :href="'#' + link.id">{{ link.text }}</a>
        <ul class="table-of-contents-2" v-if="link.children">
          <li v-for="childLink of link.children">
            <a :href="'#' + childLink.id" @click="tocItemClicked">{{ childLink.text}}</a>
          </li>
        </ul>
      </li>
    </ul>
    <Icon class="expand-toc" @click="toggleToc"
          :name="tocIconName"/>
  </div>
</template>

<style scoped>

.table-of-contents-container {
  display: flex;
  flex-direction: column;
  border: 1px solid transparent;
  align-items: flex-end;
}

.table-of-contents-container .table-of-contents {
  display: none;
  position: fixed;
  background-color: var(--color-background-mute);
  border: 1px solid var(--color-border);
  padding: 2.5rem 1rem 1rem;
  list-style: none;
}

.expand-toc {
  position: fixed;
  font-size: 2.5em;
  font-weight: bolder;
  align-self: flex-end;
}

/* TODO: Add animation to slide the table of contents into view. */
.table-of-contents-container.is-expanded .table-of-contents {
  display: block;
}
</style>