import type {CharacterFilterParams} from "~/components/characters/CharacterFilterModal.vue";
import type {CharacterModel} from "~/models/character/CharacterModel";
import {UNASSIGNED_CAMPAIGN} from "~/stores/use-characters-store";

export type CharacterFiltersType = {
  campaigns?: Set<string>,
  characterTypes?: Set<string>,
  tags?: Set<string>,
}

function compareCharToFilter(character: CharacterModel, filters: CharacterFiltersType) {
  console.group('useCharacterFilterParams().compareCharToFilter()')
  console.log('character.name: ', character.name);
  console.log('filters: ', filters);
  if (filters.campaigns && filters.campaigns.size > 0 && filters.campaigns.intersection(new Set<string>(character?.campaigns.length ? character.campaigns : [UNASSIGNED_CAMPAIGN])).size < 1) {
    console.log('Character does not match filters.campaigns');
    console.groupEnd();
    return false;
  }
  if (filters.characterTypes && filters.characterTypes.size > 0 && (!character?.characterType || !filters.characterTypes.has(character?.characterType))) {
    console.log('Character does not match filters.characterTypes');
    console.groupEnd();
    return false;
  }
  if (filters.tags && filters.tags.size > 0 && (character?.tags.length === 0 || filters.tags.intersection(new Set<string>(character.tags)).size < 1)) {
    console.log('Character does not match filters.tags');
    console.groupEnd();
    return false;
  }
  console.log('Character matches all filters');
  console.groupEnd();
  return true;
}

function navigateToFilter(filterParams: CharacterFilterParams) {
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
  navigateTo({query});
}

export function useCharacterFilterParams() {

  const route = useRoute();

  const filterParams = computed(() => {

    const fp = {} as CharacterFilterParams;

    if (typeof route.query !== "undefined") {
      if (typeof route.query?.campaigns === 'string') {
        const campaigns = [] as string[];
        campaigns.push(...route.query.campaigns.split(','));
        fp.campaigns = campaigns;
      }
      if (typeof route.query?.characterTypes === 'string') {
        const characterTypes = [] as string[];
        characterTypes.push(...route.query.characterTypes.split(','));
        fp.characterTypes = characterTypes;
      }
      if (typeof route.query.tags === 'string') {
        const tags = [] as string[];
        tags.push(...route.query.tags.split(','));
        fp.tags = tags;
      }
    }
    return fp;
  });

  const filterCampaigns = computed(() => filterParams.value?.campaigns ? new Set<string>(filterParams.value.campaigns) : undefined);
  const filterCharacterTypes = computed(() => filterParams.value?.characterTypes ? new Set<string>(filterParams.value.characterTypes) : undefined);
  const filterTags = computed(() => filterParams.value?.tags ? new Set<string>(filterParams.value.tags) : undefined);

  const filters = {
    campaigns: filterCampaigns.value,
    characterTypes: filterCharacterTypes.value,
    tags: filterTags.value
  }
  return {filterParams, filters, filterCampaigns, filterCharacterTypes, filterTags, navigateToFilter, compareCharToFilter};

}
