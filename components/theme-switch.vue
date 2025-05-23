<script setup lang="ts">

import type {TriSwitchPositionType} from "~/components/tri-switch.vue";

const themeSwitchPosition = ref('center' as TriSwitchPositionType);

onMounted(() => {
  let prefersDark = false;
  const prefersDarkQuery = window.matchMedia('(prefers-color-scheme: dark)');
  function handleDarkPreferenceChange(mql: MediaQueryList | MediaQueryListEvent) {
    prefersDark = mql.matches;
    setThemeOnPage(themeSwitchPosition.value);
  }
  prefersDarkQuery.addEventListener('change', handleDarkPreferenceChange);

  setThemeOnPage('center');
  watch(themeSwitchPosition, setThemeOnPage);

  function setThemeOnPage(newValue : TriSwitchPositionType) {
    prefersDark = false;
    switch (newValue) {
      case 'left':
        break;
      case 'center':
        if (prefersDarkQuery instanceof MediaQueryList) {
          prefersDark = prefersDarkQuery.matches;
        }
        break;
      case 'right':
        prefersDark = true;
        break;
    }
    const root = document.querySelector(':root');
    if (root) {
      if (prefersDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }
});

</script>

<template>
  <TriSwitch class="theme-switch" v-model="themeSwitchPosition" />
</template>

<style scoped>

.theme-switch :deep(.tri-switch-thumb) {
  background: inherit;
}
.theme-switch.left :deep(.tri-switch-thumb) {
  background: radial-gradient(orange 0, yellow 100%);
}

.theme-switch.center :deep(.tri-switch-thumb) {
  background-color: yellow;
  box-shadow:
      var(--shadow-position-neg) 0 calc(var(--thumb-size) * 0.55) black inset,
      var(--shadow-position-pos) 0 calc(var(--thumb-size) * 0.25) yellow inset
      ;

}

.theme-switch.right :deep(.tri-switch-thumb) {
  background-color: darkgrey;
  box-shadow:
      var(--shadow-position-neg) 0 calc(var(--thumb-size) * 0.5) black inset,
      var(--shadow-position-pos) 0 calc(var(--thumb-size) * 0.25) white inset;
}
</style>