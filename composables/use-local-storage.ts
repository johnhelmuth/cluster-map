
let localStorage = undefined as Storage | undefined;

export default function useLocalStorage() {

  onMounted(() => {
    if (import.meta.client) {
      localStorage = window.localStorage;
    }
  })

  function hasLocalStorage() {
    return !!localStorage;
  }

  function getLocalStorage() {
    if (localStorage) {
      return localStorage;
    }
    throw new Error('Local Storage is not available in this context.');
  }

  return { hasLocalStorage, getLocalStorage };
}