<script setup lang="ts">

import { version } from '~/package.json';

const appVersion = `v${version}`;
const copyrightDate = "2024";

</script>

<template>
  <footer>
    <span class="left">Version {{ appVersion }}</span>
    <span class="right">&copy; John Helmuth and the In Dire Straits players {{ copyrightDate }}</span>
  </footer>
</template>

<style scoped>
footer {
  text-align: center;
  height: 1rem;
  flex: 0 1 auto;
  justify-self: end;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  font-size: clamp(.5rem, 3cqw, 1rem);
  padding-top: .8rem;
  padding-bottom: .8rem;
}
footer span {
  text-align: left;
  width: max-content;
  flex: 0 1 auto;
}
footer span.right {
  text-align: right;
  width: max-content;
  flex: 0 1 auto;
}

@media (max-width: 303px) {
  footer span {
    width: auto;
    height: auto;
  }
}

</style>
