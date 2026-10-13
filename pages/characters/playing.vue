<script setup lang="ts">

import {dragAndDrop} from "@formkit/drag-and-drop/vue";
import { animations } from "@formkit/drag-and-drop";
import {useCharactersStore} from "~/stores/use-characters-store";
import type {CharacterModel} from "~/models/character/CharacterModel";

const route = useRoute();

const {userPreferences} = useUserPreferences();

const {getCharacters} = await useCharactersStore();

const parentRef = useTemplateRef("charactersContainer");

const characterIds = ref([] as string[]);

const chars = computed(() => {
  if (typeof characterIds.value !== 'undefined' && characterIds.value.length > 0) {
    return getCharacters(characterIds.value);
  }
});

watch(characterIds, () => {
  if (import.meta.client) {
    if (characterIds.value.length < 1 && typeof userPreferences.nowPlayingCharacters !== "undefined") {
      characterIds.value = [...userPreferences.nowPlayingCharacters];
    }
  }
  updateAddress();
})

onMounted(() => {
  const charIds = [] as string[];
  if (typeof route.query !== "undefined" && typeof route.query?.chars === "string") {
    charIds.push(...route.query.chars.split(','));
  }
  if (import.meta.client) {
    if (charIds.length < 1 && typeof userPreferences.nowPlayingCharacters !== "undefined") {
      charIds.splice(0, charIds.length);
      charIds.push(...userPreferences.nowPlayingCharacters);
    }
  }
  characterIds.value = charIds;
})

function updateAddress() {
  let routeOptions = {
    path: '/characters/playing',
  } as { path: string; query?: { chars: string }};
  if (characterIds.value.length > 0) {
    routeOptions.query = { chars: characterIds.value.join(',') };
  }
  navigateTo(routeOptions)
}
dragAndDrop(
    {
      parent: parentRef,
      values: characterIds,
      dragHandle: '.character-drag',
      draggingClass: 'dragging',
      dragPlaceholderClass: 'being-dragged',
      draggable: (el) => {
        return el.classList.contains('col-content');
      },
      onDragend: () => {
        navigateTo({ path: '/characters/playing', query: { chars: characterIds.value.join(',')}})
      },
      plugins: [animations()]
    }
)

function changedCharacterIds(charIds: string[]) {
  if (typeof charIds !== 'undefined') {
    characterIds.value = charIds;
  }
}

useSeoMeta({
  title: () => `Now Playing Characters`,
})
</script>

<template>
  <InfoPage page_title="Now Playing Characters">
    <NowPlayingModal :selected-character-ids="characterIds" @changed="changedCharacterIds"/>
    <div v-if="chars?.length" class="characters-container" ref="charactersContainer">
      <div class="col-headers no-drag">
        <div class="character-name-etc">Name/Player/Type/Tags</div>
        <div class="character-description">Description</div>
        <div class="character-aspects">Aspects</div>
        <div class="character-traits">Peak traits</div>
      </div>
      <div v-if="chars.length" v-for="character in chars" :id="character.id" :key="character.id" class="character col-content">
        <div class="character-drag">
          <Icon name="material-symbols:drag-indicator"/>
        </div>
        <div class="character-name-etc">
          <NuxtLink v-if="character.toLink()" :to="character.toLink()">
            {{ character.name }}
          </NuxtLink>
          <div v-else>{{ character.name }}</div>
          <div v-if="character.playerName">{{ character.playerName }}</div>
          <div v-if="character.characterType && (! character.playerName || character.characterType !== 'PC')">Type:
            {{ character.characterType }}
          </div>
          <div class="tags-list" v-if="character.tags.length > 0">Tags:
            <div>{{ character.renderTagsList() }}</div>
          </div>
        </div>
        <div class="character-description">{{ character.description }}</div>
        <div class="character-aspects">
          <AspectList
              :aspects="character.aspects"
              hide-header
              v-if="character.aspects && character.aspects.length"
              class="block aspect-list left-half"
          />
        </div>
        <div class="character-traits">
          <TraitList
              v-if="character.peakTraits() && character.peakTraits().length"
              :traits="character.peakTraits()"
              view-type="rank"
              hideViewTypeSelector
              hide-header
              class="block trait-list right-half"
              firstCol="name"
          />
          <p v-else>No Aspects for character.</p>
        </div>
      </div>
    </div>
    <div v-else>Requested characters not found.</div>
  </InfoPage>
</template>

<style scoped>

div .characters-container {
  background-color: var(--color-background);
  margin-top: 0;
  border: 1px solid var(--color-border);
  display: grid;
  grid-template-columns: 1.5rem repeat(3, 1fr) 14rem;
  grid-template-rows: 1fr auto;
  grid-gap: 1rem;
}

div .characters-container .col-headers, div .characters-container .col-content {
  display: grid;
  grid-column: 1 / -1;
  grid-template-areas: "hdl name    description description description"
                       "hdl aspects aspects     aspects     traits     ";
  border-bottom: 1px solid var(--color-border);
}

div .characters-container .col-headers {
  font-size: .8rem;
  border: none;
  grid-row: 1 / 2;
  background-color: var(--color-background-soft);
  text-align: center;
}

div .characters-container .col-content {
  grid-column: 1 / -1;
  grid-template-columns: subgrid;
  grid-auto-rows: min-content min-content;
  grid-row-gap: 1rem;
  padding-left: .5rem;
}
div .characters-container .col-content.dragging {
  background-color: var(--color-background);
}
div .characters-container .col-content.being-dragged {
  display: none;
}

div .characters-container .character-name-etc {
  grid-area: name;
}

div .characters-container .character-description {
  grid-area: description;
}

div .characters-container .character-aspects {
  grid-area: aspects;
}

div .characters-container .character-traits {
  grid-area: traits;
}

.block {
  min-width: 12rem;
  container-name: block;
  container-type: inline-size;
}

@media (max-width: 760px) {
  div .characters-container .col-headers, div .characters-container .col-content {
    display: grid;
    grid-column: 1 / -1;
    grid-template-columns: 1fr 1fr;
    grid-template-areas: "name        traits     "
                         "aspects     aspects    "
                         "description description";
  }

  div .characters-container .col-content {
    border-bottom: 1px solid var(--color-border);
    padding-bottom: 1rem;
  }

  div .characters-container .col-content .character-description {
    margin: 0 1rem;
  }
}

@media (max-width: 640px) {
  div .characters-container .character-traits {
    font-size: .90rem;
  }
}

div.tags-list {
  display: flex;
  gap: .25rem;
}

div.tags-list :last-child {
  font-style: italic;
}

</style>