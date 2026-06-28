<script setup lang="ts">


import {useCharactersStore} from "~/stores/use-characters-store";
import type {CharacterModel} from "~/models/character/CharacterModel";
import type {CharacterFilterParams} from "~/components/characters/CharacterFilterModal.vue";

const route = useRoute();

const filterParams = computed(() => {
  if (typeof route.query !== "undefined") {
    const filterParams = {} as CharacterFilterParams;
    if (typeof route.query?.campaigns === 'string') {
      const campaigns = [] as string[];
      campaigns.push(... route.query.campaigns.split(','));
      filterParams.campaigns = campaigns;
    }
    if (typeof route.query?.characterTypes === 'string') {
      const characterTypes = [] as string[];
      characterTypes.push(... route.query.characterTypes.split(','));
      filterParams.characterTypes = characterTypes;
    }
    if (typeof route.query.tags === 'string') {
      const tags = [] as string[];
      tags.push(...route.query.tags.split(','));
      filterParams.tags = tags;
    }
    return filterParams;
  }
});

const { characters, getCampaignTitle, getCharacterCampaigns, UNASSIGNED_CAMPAIGN,  } = useCharactersStore();


const filterCampaigns = computed(() => filterParams.value?.campaigns ? new Set<string>(filterParams.value.campaigns) : undefined);
const filterCharacterTypes = computed(() => filterParams.value?.characterTypes ? new Set<string>(filterParams.value.characterTypes) : undefined);
const filterTags = computed(() => filterParams.value?.tags ? new Set<string>(filterParams.value.tags) : undefined);

type CharacterFiltersType = {
  campaigns?:  Set<string>,
  characterTypes?:  Set<string>,
  tags?:  Set<string>,
}
function compareCharToFilter(character: CharacterModel, filters: CharacterFiltersType) {
  if (filters.campaigns && filters.campaigns.size > 0 && filters.campaigns.intersection(new Set<string>(character?.campaigns.length ? character.campaigns : [UNASSIGNED_CAMPAIGN])).size < 1) {
    return false;
  }
  if (filters.characterTypes && filters.characterTypes.size > 0 && (! character?.characterType || ! filters.characterTypes.has(character?.characterType))) {
    return false;
  }
  if (filters.tags && filters.tags.size > 0 && (character?.tags.length === 0 || filters.tags.intersection(new Set<string>(character.tags)).size < 1)) {
    return false;
  }
  return true;
}

const chars = computed(() => {
  const charMap = new Map<string, Array<CharacterModel>>();
  const filters = {
    campaigns: filterCampaigns.value,
    characterTypes: filterCharacterTypes.value,
    tags: filterTags.value
  }
  if (typeof characters.value !== "undefined") {
    characters.value.forEach((character, id) => {
      const matches = compareCharToFilter(character, filters);
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
  }
  return charMap;
});

function applyFilter(filterParams: CharacterFilterParams) {
  const query = {} as Record<keyof CharacterFilterParams, string>;
  if (filterParams?.campaigns && filterParams?.campaigns?.length > 0) {
    query.campaigns = filterParams.campaigns.join(',');
  }
  if (filterParams?.characterTypes && filterParams?.characterTypes?.length > 0) {
    query.characterTypes = filterParams.characterTypes.join(',');
  }
  if (filterParams?.tags && filterParams?.tags?.length > 0) {
    query.tags = filterParams.tags.join(',');
  }
  navigateTo({ query });
}

useSeoMeta({
  title: () => `Characters`,
})
</script>

<template>
  <InfoPage page_title="Characters">
    <CharacterFilterModal :params="filterParams" @changed="applyFilter"/>
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
          <th>Name/Player/Type/Tags</th>
          <th>Description</th>
          <th>Aspects</th>
        </tr>
        <template v-if="campChars.length" v-for="character in campChars">
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