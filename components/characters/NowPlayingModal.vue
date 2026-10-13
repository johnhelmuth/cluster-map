<script setup lang="ts">

import {useModalStateStore} from "~/stores/use-modal-state-store";
import {useCharactersStore} from "~/stores/use-characters-store";
import useUserPreferences from "~/composables/use-user-preferences";

const { getCharacters } = await useCharactersStore();
const { userPreferences, savePreferences } = useUserPreferences();

const { setCurrentOpenModal, closeModal } = useModalStateStore('nowPlayingModal', toggleNowPlayingModal);

const props = defineProps<{
  selectedCharacterIds?: string[];
}>();

const emit = defineEmits<{
  changed: [charIds: string[]]
}>();

const modalIconClosedName = 'material-symbols:filter-list-rounded';
const modalIconOpenName = 'material-symbols:close-rounded'
const modalIconName = ref(modalIconClosedName);

const isActive = ref(false);

function toggleNowPlayingModal() {
  isActive.value = !isActive.value;
  if (isActive.value) {
    setCurrentOpenModal();
    modalIconName.value = modalIconOpenName;
  } else {
    closeModal();
    modalIconName.value = modalIconClosedName;
  }
}

const characters = computed(() => {
  if (typeof props.selectedCharacterIds !== 'undefined') {
    return getCharacters(props.selectedCharacterIds)
  }
});

function saveDefault() {
  if (typeof props.selectedCharacterIds !== 'undefined') {
    userPreferences.nowPlayingCharacters = props.selectedCharacterIds;
    savePreferences();
  }
  closeModal();
}

function noOp(e: SubmitEvent) {
  e.preventDefault();
}

function clearCharacter(charId: string) {
  if (typeof props.selectedCharacterIds !== 'undefined'
      && props.selectedCharacterIds.includes(charId)
  ) {
    const charIds = [...props.selectedCharacterIds].filter((c) => charId !== c);
    emit('changed', charIds)
  }
}

function resetToDefault() {
  emit('changed', [] as string[]);
  closeModal();
}

</script>

<template>
  <div class="now-playing-modal-container"
       :class='{"is-active": isActive}'
  >
    <div class="now-playing-modal">
      <h3>Actions</h3>
      <form name="now-playing-modal-form" @submit="noOp">
        <ul v-if="typeof characters !== 'undefined'">
          <li v-for="(c) in characters" :key="c.id">
            <div class="selected-name">{{ c.name }}</div>
            <div class="selected-hc">{{ c.highConcept() }}</div>
            <div class="selected-controls"><Icon name="material-symbols:delete-outline-rounded" @click="clearCharacter(c.id)" :title="`Unselect ${c.name}`"/></div>
          </li>
        </ul>
        <div class="now-playing-actions">
          <button class="reset-to-default-action" @click="resetToDefault" title="Revert to default selected.">Reset to default</button>
          <button class="save-action" @click="saveDefault">Save Default<br />Now Playing<br>Characters</button>
        </div>
      </form>
    </div>

    <Icon class="show-now-playing" @click="toggleNowPlayingModal"
          :name="modalIconName"/>

  </div>
</template>

<style scoped>
.now-playing-modal-container {
  position: fixed;
  position-anchor: --info-content;
  right: calc(anchor(right) + .5rem);
  top: calc(anchor(top) + .5rem);
  display: flex;
  flex-direction: column;
  border: 1px solid transparent;
  align-items: flex-end;
}

.now-playing-modal-container .now-playing-modal {
  display: none;
  position: fixed;
  background-color: var(--color-background-mute);
  border: 1px solid var(--color-border);
  padding: 1rem 1rem 1rem;
  z-index: var(--layers-navigation);
  box-shadow: inset -0.1rem -0.1rem 0.1rem grey,
  inset 0.1rem 0.1rem 0.1rem lightgrey;
}
.show-now-playing {
  position: fixed;
  font-size: 1.5em;
  font-weight: bolder;
  align-self: flex-end;
  margin: 0.5rem 0.05rem;
  z-index: var(--layers-navigation);
  cursor: pointer;
}
.now-playing-modal-container.is-active .now-playing-modal {
  display: block;
}
.now-playing-modal-container .now-playing-modal h3 {
  text-align: center;
  margin-top: -0.5rem;
}
.now-playing-modal-container .now-playing-modal ul {
  list-style: none;
  padding: 0.5rem 0;
  display: grid;
  grid-template-columns: 1rem fit-content(12rem) min-content;
  grid-row-gap: .5rem;
  grid-column-gap: .5rem;
  align-items: center;
  width: 100%;
}

.now-playing-modal-container .now-playing-modal ul li {
  grid-column: 1 / -1;
  width: 100%;
  display: grid;
  grid-template-columns: subgrid;
  grid-auto-rows: min-content;
  grid-template-areas: "name name name"
                       ". aspect controls";
  align-items: center;
  padding: 0 0.5rem;
  margin-top: .5rem;
  border: 1px solid var(--color-border);
  background-color: var(--color-background);
}
.now-playing-modal-container .now-playing-modal ul li .selected-name {
  grid-area: name;
  font-weight: bold;
}
.now-playing-modal-container .now-playing-modal ul li .selected-hc {
  grid-area: aspect;
  font-style: italic;
}
.now-playing-modal-container .now-playing-modal ul li .selected-controls {
  text-align: center;
  grid-area: controls;
}
.now-playing-actions {
  display: flex;
  justify-content: space-around;
}

</style>