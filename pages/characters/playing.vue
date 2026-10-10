<script setup lang="ts">

import {useCharactersStore} from "~/stores/use-characters-store";

const route = useRoute();

const { getCharacters, getCampaignTitle } = await useCharactersStore();

const characterIds = computed(() => {
  if (typeof route.query !== "undefined" && typeof route.query?.chars === "string") {
    const charIds = [] as string[];
    charIds.push(...route.query.chars.split(','));
    return charIds;
  }
})

const chars = computed(() => {
  if (typeof characterIds.value !== 'undefined') {
    return getCharacters(characterIds.value);
  }
})

</script>

<template>
  <InfoPage page_title="Playing Characters">
    <table v-if="chars?.length" class="characters-table">
      <tbody>
      <tr class="col-headers">
        <th>Name/Player/Type/Tags</th>
        <th>Description</th>
        <th>Aspects</th>
        <th>Peak traits</th>
      </tr>
      <template v-if="chars.length" v-for="character in chars">
        <tr :id="character.id">
          <td>
            <NuxtLink v-if="character.toLink()" :to="character.toLink()">
              {{ character.name }}
            </NuxtLink>
            <div v-else>{{ character.name }}</div>
            <div v-if="character.playerName">{{ character.playerName }}</div>
            <div v-if="character.characterType && (! character.playerName || character.characterType !== 'PC')">Type: {{ character.characterType }}</div>
            <div class="tags-list" v-if="character.tags.length > 0">Tags: <div>{{ character.renderTagsList() }}</div></div>
          </td>
          <td>{{ character.description }}</td>
          <td>
            <ul v-if="character.aspects && character.aspects.length" class="aspects-list">
              <li v-for="aspect in character.aspects">
                <span v-if="aspect.aspectType">{{ aspect.aspectType }}: </span><strong>{{ aspect.name }}</strong>
              </li>
            </ul>
            <p v-else>No Aspects for character.</p>
          </td>
          <td>
            <ul v-if="character.peakTraits() && character.peakTraits().length" class="traits-list">
              <TraitList
                  :traits="character.peakTraits()"
                  view-type="rank"
                  hideViewTypeSelector
                  class="block trait-list right-half"
              />
            </ul>
            <p v-else>No Aspects for character.</p>
          </td>
        </tr>
      </template>
      </tbody>
    </table>
    <div v-else>Request characters not found.</div>
  </InfoPage>
</template>

<style scoped>

div table.characters-table {
  background-color: var(--color-background);
  border: none;
  margin-top: 0;
}

div table.characters-table thead {
  border: 1px solid var(--color-border);
}

table tr.col-headers th {
  font-size: .8rem;
  border: none;
  background-color: var(--color-background-soft);
}

table tr td {
  vertical-align: top;
}

div.tags-list {
  display: flex;
  gap: .25rem;
}
div.tags-list :last-child {
  font-style: italic;
}

table tr td ul {
  list-style: none;
  padding-left: .5rem;
  padding-right: .5rem;
  gap: 0.5rem;
}

table tr td ul.aspects-list li {
  margin: 0.5rem auto;
}

table tr td ul.aspects-list li :last-child {
  font-style: italic;
}
</style>