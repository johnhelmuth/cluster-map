<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps({
  error: Object as () => NuxtError,
})

</script>

<template>
  <div class="error-container">
    <h1>{{ error?.statusCode || 'Unknown Error happened'}}</h1>
    <p v-if="error?.statusMessage">{{ error.statusMessage}}</p>
    <NuxtLink to="/">Go back home</NuxtLink>
  </div>
</template>

<style scoped>
 div.error-container {
   height: min(15rem, 100vh);
   display: grid;
   grid-template-columns: 1fr;
   justify-items: center;
   align-items: center;
   font-size: 1.5rem;
 }

 h1 {
   font-weight: bolder;
   font-size: 3rem;
 }

 a {
   text-decoration-line: underline;
 }
</style>