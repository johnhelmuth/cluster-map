<script setup lang="ts">

import { version } from '../../package.json';

const appVersion = `v${version}`;
const copyrightDate = "2024";

</script>

<template>
  <footer><span class="left">Version {{ appVersion }}</span><span class="right">&copy; John Helmuth and the In Dire Straits players {{ copyrightDate }}</span></footer>
</template>

<style scoped>
footer {
  text-align: center;
  min-height: 1rem;
  flex: 0 1 auto;
  justify-self: end;
  display: flex;
  flex-direction: row;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: end;
  font-size: .8rem;
}
footer span {
  width: 48%;
  text-align: left;
}
footer span.right {
  text-align: right;
}

</style>
