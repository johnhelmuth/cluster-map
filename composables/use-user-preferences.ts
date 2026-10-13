
import type {TraitViewTypesKeys} from "~/types/character/CharacterTypes";
import {isUserPreferences} from "~/utils/import-validator";

const LOCALSTORAGE_USER_PREFERENCES_KEY = 'cm-user-preferences';

const USER_PREFERENCES_SCHEMA_VERSION = '2';
export type UserPreferencesData = {
  type: 'user-preferences',
  schemaVersion: typeof USER_PREFERENCES_SCHEMA_VERSION,
  characterSheet: {
    traitViewStyle: TraitViewTypesKeys,
  },
  nowPlayingCharacters: string[],
  lastUpdated: number;
}

const userPreferences = reactive<UserPreferencesData>({
  type: 'user-preferences',
  schemaVersion: USER_PREFERENCES_SCHEMA_VERSION,
  characterSheet: {
    traitViewStyle: 'name',
  },
  nowPlayingCharacters: [],
  lastUpdated: 0,
})

export default function useUserPreferences() {

  const {getLocalStorage, hasLocalStorage} = useLocalStorage();

  onMounted(() => {
    if (import.meta.client) {
      initializeStorage();
    }
  })

  function initializeStorage() {
    if (hasLocalStorage()) {
      const lsUserPreferencesJSON = getLocalStorage().getItem(LOCALSTORAGE_USER_PREFERENCES_KEY);
      if (! lsUserPreferencesJSON) {
        savePreferences();
      } else {
        let needsUpdate = false;
        const lsUserPreferences = JSON.parse(lsUserPreferencesJSON);
        if (
          typeof lsUserPreferences !== "undefined"
          && typeof lsUserPreferences.schemaVersion !== "undefined"
          && lsUserPreferences.schemaVersion < USER_PREFERENCES_SCHEMA_VERSION
        ) {
          /* Convert version 1 to version 2 */
          if (typeof lsUserPreferences.nowPlayingCharacters === 'undefined') {
            lsUserPreferences.nowPlayingCharacters = [] as string[];
          }
          lsUserPreferences.schemaVersion = USER_PREFERENCES_SCHEMA_VERSION;
          needsUpdate = true;
        }
        if (lsUserPreferences && isUserPreferences(lsUserPreferences)) {
          userPreferences.characterSheet.traitViewStyle = lsUserPreferences.characterSheet.traitViewStyle;
          userPreferences.nowPlayingCharacters = lsUserPreferences.nowPlayingCharacters ?? [] as string[];
          userPreferences.lastUpdated = lsUserPreferences.lastUpdated;
          if (needsUpdate) {
            savePreferences();
          }
        }
      }
    }
  }

  function resetPreferences() {
    initializeStorage();
  }

  function savePreferences() {
    userPreferences.lastUpdated = Date.now();
    getLocalStorage().setItem(LOCALSTORAGE_USER_PREFERENCES_KEY, JSON.stringify(userPreferences));
  }

  return { userPreferences, resetPreferences, savePreferences }
}