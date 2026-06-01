<script setup lang="ts">
import {
  TraitViewTypes
} from "~/types/character/CharacterTypes";


const {userPreferences, resetPreferences, savePreferences } = useUserPreferences();

const traitViewStyle = ref(userPreferences.characterSheet.traitViewStyle);
const settingsChanged = ref(false);

useSeoMeta({
  title: () => `Settings`,
})

watch(traitViewStyle, (newVal, oldVal) => {
  if (newVal !== oldVal && newVal !== userPreferences.characterSheet.traitViewStyle) {
    settingsChanged.value = true;
  }
})
watch(userPreferences, (newVal, oldVal) => {
  console.log('watch(userPreferences, newVal, oldVal)', newVal, oldVal);
  traitViewStyle.value = userPreferences.characterSheet.traitViewStyle;
  settingsChanged.value = false;
})

function resetSettings() {
  console.log('resetSettings() userPreferences', userPreferences);
  console.log('resetSettings() traitViewStyle', traitViewStyle);
  traitViewStyle.value = userPreferences.characterSheet.traitViewStyle;
  settingsChanged.value = false;
}

function applySettings() {
  console.log('resetSettings() userPreferences', userPreferences);
  console.log('resetSettings() traitViewStyle', traitViewStyle);
  userPreferences.characterSheet.traitViewStyle = traitViewStyle.value;
  savePreferences();
  settingsChanged.value = false;

}

</script>

<template>
  <InfoPage page_title="Settings" max-width-rems="40">

    <main>
      <section class="settings">
        <p>Things that change how the site works.</p>
        <h2>Character sheet preferences</h2>
        <div class="charsheet-settings">
          <p>Preferences related to how character sheets are rendered.</p>
          <p class="note">Note: These settings are stored in your browser's local storage.</p>
          <ul class="charsheet-settings-list settings-list">
            <li>
              <label for="trait-view-style">Trait View Style</label>
              <select id="trait-view-style" aria-label="Trait list format type" v-model="traitViewStyle">
                <option
                    v-for="(label, value) in TraitViewTypes"
                    :value="value"
                >
                  {{ label }}
                </option>
              </select>
              <aside class="note">
                <p>This setting changes how the traits list (Skills, Approaches, etc) is rendered, by default, on the character sheet.</p>
                <ul class="trait-view-setting-list">
                  <li><div>By Name:</div><div>The traits are listed vertically, ordered by the trait name.</div></li>
                  <li><div>By Rank:</div><div>The traits are listed vertically, ordered by the trait rank.</div></li>
                  <li><div>Pyramid:</div><div>The traits are listed in a pyramid, each rank on its own row in ascending order, and each rank's traits listed in that row.</div></li>
                </ul>
              </aside>
            </li>
          </ul>

        </div>
        <div class="actions">
          <button class="action-button action-reset" :disabled="! settingsChanged" @click="resetSettings">Reset</button>
          <button class="action-button action-apply" :disabled="! settingsChanged" @click="applySettings">Apply</button>
        </div>
      </section>
    </main>
  </InfoPage>
</template>

<style scoped>

main {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

main section {
  margin: 1rem;
}

h2, h3 {
  font-weight: bold;
}

h3 {
  font-size: 1.1rem;
}

p.note {
  font-size: smaller;
  font-style: italic;
  text-indent: 3rem;
}

ul.settings-list {
  list-style: none;
}

ul.settings-list li label:after {
  content: ':';
  margin-right: 1rem;
}

aside.note {
  font-size: smaller;
  font-style: italic;
  margin: .5rem 1rem;
}

aside.note ul.trait-view-setting-list {
  padding-left: 0;
  display: grid;
  grid-template-columns: 1fr 6fr;
  grid-auto-rows: min-content;
}
aside.note ul li {
  grid-column: 1/-1;
  display: grid;
  grid-template-columns: subgrid;
}
aside.note ul li :first-child {
  justify-self: end;
  font-weight: 600;
}
aside.note ul li :last-child {
  margin-left: .5rem;
}

.actions {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  height: 3rem;
  margin-top: 2rem;
}

</style>
