<script setup lang="ts">

definePageMeta({
  middleware: ['authenticated'],
});

const { user, clear } = useUserSession();

async function logout() {
  await clear();
  navigateTo('/');
}

</script>

<template>
  <div>
    <pre>{{ user }}</pre>
    <button @click="logout">Logout</button>
  </div>

</template>

<style scoped>

</style>