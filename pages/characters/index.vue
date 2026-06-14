<script setup lang="ts">


import {useCharactersStore} from "~/stores/use-characters-store";
import type {CharacterModel} from "~/models/character/CharacterModel";
import type {CharacterFilterParams} from "~/components/characters/CharacterFilterModal.vue";
import {useCharacterFilterParams} from "~/composables/use-character-filter-params";

const route = useRoute();

const { characters, getCampaignTitle, UNASSIGNED_CAMPAIGN } = useCharactersStore();
const charFilterParams = useCharacterFilterParams();

const chars = computed(() => {
  const charMap = new Map<string, Array<CharacterModel>>();
  characters.forEach((character, id) => {
    const matches = charFilterParams.compareCharToFilter(character, charFilterParams.filters);
    if (matches) {
      if (character.campaigns.length === 0) {
        const campaignChars = charMap.get(UNASSIGNED_CAMPAIGN) || [];
        campaignChars.push(character);
        charMap.set(UNASSIGNED_CAMPAIGN, campaignChars);
      } else {
        [...character.campaigns].forEach((campaign) => {
          const campaignChars = charMap.get(campaign) || [];
          campaignChars.push(character);
          charMap.set(campaign, campaignChars);
        });
      }
    }
  })
  return charMap;
});

useSeoMeta({
  title: () => `Characters`,
})
</script>

<template>
  <InfoPage page_title="Characters">
    <CharacterFilterModal :params="charFilterParams.filterParams.value" @changed="charFilterParams.navigateToFilter"/>
    <table v-if="chars.size" class="characters-table">
      <template v-for="[campaign, campChars] in chars.entries()">
        <tbody>
        <tr class="campaign-header">
          <th colspan="4">
            <div>
              {{ campaign !== UNASSIGNED_CAMPAIGN ? getCampaignTitle(campaign) : 'No campaign' }}
            </div>
          </th>
        </tr>
        <tr class="col-headers">
          <th>ID</th>
          <th>Name/Player/Type/Tags</th>
          <th>Description</th>
          <th>Aspects</th>
        </tr>
        <template v-if="campChars.length" v-for="character in campChars">
          <tr :id="character.id">
            <td>{{ character.id }}</td>
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
              <ul v-if="character.aspects && character.aspects.length">
                <li v-for="aspect in character.aspects">
                  <span v-if="aspect.aspectType">{{ aspect.aspectType }}: </span><strong>{{ aspect.name }}</strong>
                </li>
              </ul>
              <p v-else>No Aspects for character.</p>
            </td>
          </tr>
        </template>
        </tbody>
      </template>
    </table>
    <div v-else>No characters match filters.</div>
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

table tr.campaign-header {
  border: none;
}

table tr.campaign-header th {
  padding: 0;
  background-color: var(--color-background-soft);
  border: none;
}

table tr.campaign-header th div {
  font-weight: bold;
  width: 100%;
  margin-top: 1rem;
  border-color: var(--color-border);
}

table tr.col-headers th {
  font-size: .8rem;
  border: none;
  background-color: var(--color-background-soft);
}

div.tags-list {
  display: flex;
  gap: .25rem;
}
div.tags-list :last-child {
  font-style: italic;
}
</style>