<script setup lang="ts">

import {useModalStateStore} from "~/stores/use-modal-state-store";
import {useCharactersStore} from "~/stores/use-characters-store";
import {CharacterTypes} from "~/types/character/CharacterTypes";

export type CharacterFilterParams = {
  campaigns?: string[];
  characterTypes?: string[];
  tags?: string[];
}

const { getCharacterTags, getCharacterCampaigns, getCampaignTitle } = useCharactersStore();

const { setCurrentOpenModal, closeModal } = useModalStateStore('characterFilterModAl', toggleCharacterFilterModal);

const props = defineProps<{
  params?: CharacterFilterParams
}>();

const emit = defineEmits<{
  closed: true;
  changed: [filters: CharacterFilterParams];
}>();

const campaignsList = computed(() => {
  return getCharacterCampaigns();
})
const tagsList = computed(() => {
  return getCharacterTags();
})

const filterIconClosedName = 'material-symbols:filter-list-rounded';
const filterIconOpenName = 'material-symbols:close-rounded'
const filterIconName = ref(filterIconClosedName);

const isActive = ref(false);
const selectedCampaigns = ref<string[]>(props.params?.campaigns ? [...props.params.campaigns] : []);
const selectedCharacterTypes = ref<string[]>(props.params?.characterTypes ? [...props.params.characterTypes] : []);
const selectedTags = ref<string[]>((props.params?.tags) ? [...props.params.tags] : []);

function toggleCharacterFilterModal() {
  isActive.value = !isActive.value;
  if (isActive.value) {
    setCurrentOpenModal();
    filterIconName.value = filterIconOpenName;
  } else {
    closeModal();
    filterIconName.value = filterIconClosedName;
  }
}

function applyFilters(e: Event) {
  emit('changed', {
    campaigns: selectedCampaigns.value,
    characterTypes: selectedCharacterTypes.value,
    tags: selectedTags.value,
  })
  toggleCharacterFilterModal();
  e.preventDefault();
  return false;
}

function clearFilters() {
  emit('changed', {});
}

function resetFilters() {
  selectedCampaigns.value = props.params?.campaigns ? [...props.params.campaigns] : [];
  selectedCharacterTypes.value = props.params?.characterTypes ? [...props.params.characterTypes] : [];
  selectedTags.value = (props.params?.tags) ? [...props.params.tags] : [];
}

function clearCampaigns() {
  selectedCampaigns.value = [] as string[];
}

function clearCharacterTypes() {
  selectedCharacterTypes.value = [] as string[];
}

function clearTags() {
  selectedTags.value = [] as string[];
}
</script>

<template>
  <div class="character-filter-container"
       :class='{"is-active": isActive}'
  >
    <div class="character-filter">
      <h3>Filters</h3>
      <form name="character-filter-form">
        <ul>
          <li>
            <label for="campaigns">Campaigns</label>
            <Icon name="material-symbols:delete-outline-rounded" @click="clearCampaigns" />
            <select id="campaigns" v-model="selectedCampaigns" class="campaigns-selector" multiple :size="Math.min(campaignsList.size, 4)">
              <option v-for="campaign in campaignsList" :key="campaign" :value="campaign">{{ getCampaignTitle(campaign) }}</option>
            </select>
          </li>
          <li>
            <label for="character-types">Character Types</label>
            <Icon name="material-symbols:delete-outline-rounded" @click="clearCharacterTypes" />
            <select id="character-types" v-model="selectedCharacterTypes" class="character-types-selector" multiple size="3">
              <option v-for="(charTypeLabel, charType) in CharacterTypes" :key="charType" :value="charType">{{ charTypeLabel }}</option>
            </select>
          </li>
          <li>
            <label for="tags">Tags</label>
            <Icon name="material-symbols:delete-outline-rounded" @click="clearTags" />
            <select id="tags" v-model="selectedTags" class="tags-selector" multiple size="4">
              <option v-for="tag in tagsList" :key="tag" :value="tag">{{ tag }}</option>
            </select>
          </li>
        </ul>
        <div class="filter-actions">
          <button class="clear-action" @click="clearFilters">Clear</button>
          <button class="reset-action" @click="resetFilters">Reset</button>
          <button class="apply-action" @click="applyFilters">Apply</button>
        </div>
      </form>
    </div>

    <Icon class="show-filters" @click="toggleCharacterFilterModal"
          :name="filterIconName"/>
  </div>
</template>

<style scoped>
.character-filter-container {
  position: fixed;
  position-anchor: --info-content;
  right: calc(anchor(right) + .5rem);
  top: calc(anchor(top) + .5rem);
  display: flex;
  flex-direction: column;
  border: 1px solid transparent;
  align-items: flex-end;
}

.character-filter-container .character-filter {
  display: none;
  position: fixed;
  background-color: var(--color-background-mute);
  border: 1px solid var(--color-border);
  padding: 1rem 1rem 1rem;
  z-index: var(--layers-navigation);
  box-shadow: inset -0.1rem -0.1rem 0.1rem grey,
  inset 0.1rem 0.1rem 0.1rem lightgrey;
}
.show-filters {
  position: fixed;
  font-size: 1.5em;
  font-weight: bolder;
  align-self: flex-end;
  margin: 0.5rem 0.5rem;
  z-index: var(--layers-navigation);
  cursor: pointer;
}
.character-filter-container.is-active .character-filter {
  display: block;
}
.character-filter-container .character-filter h3 {
  text-align: center;
  margin-top: -0.5rem;
}
.character-filter-container .character-filter ul {
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  width: 100%;
}

.character-filter-container .character-filter ul li {
  grid-column: 1 / -1;
  width: 100%;
  display: grid;
  grid-template-columns: subgrid;
  grid-auto-rows: min-content;
  align-items: center;
  margin-top: .5rem;

}

.filter-actions {
  display: flex;
  justify-content: space-between;
}

</style>