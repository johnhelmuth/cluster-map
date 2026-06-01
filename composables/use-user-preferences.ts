
import type {TraitViewTypesKeys} from "~/types/character/CharacterTypes";
import {isUserPreferences} from "~/utils/import-validator";

const LOCALSTORAGE_USER_PREFERENCES_KEY = 'cm-user-preferences';

const USER_PREFERENCES_SCHEMA_VERSION = '1';
export type UserPreferencesData = {
  type: 'user-preferences',
  schemaVersion: typeof USER_PREFERENCES_SCHEMA_VERSION,
  characterSheet: {
    traitViewStyle: TraitViewTypesKeys,
  },
  lastUpdated: number;
}

const userPreferences = reactive<UserPreferencesData>({
  type: 'user-preferences',
  schemaVersion: '1',
  characterSheet: {
    traitViewStyle: 'name',
  },
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
        const lsUserPreferences = JSON.parse(lsUserPreferencesJSON);
        if (lsUserPreferences && isUserPreferences(lsUserPreferences)) {
          userPreferences.characterSheet.traitViewStyle = lsUserPreferences.characterSheet.traitViewStyle;
          userPreferences.lastUpdated = lsUserPreferences.lastUpdated;
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