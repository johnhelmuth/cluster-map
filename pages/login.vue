<script setup lang="ts">
const { loggedIn, user, fetch: refreshSession, clear } = useUserSession()
const credentials = reactive({
  username: '',
  password: '',
})
async function login() {
  $fetch('/api/login', {
    method: 'POST',
    body: credentials
  })
      .then(async () => {
        // Refresh the session on client-side and redirect to the home page
        await refreshSession()
        await navigateTo('/')
      })
      .catch(() => alert('Bad credentials'))
}
async function logout() {
  await $fetch('/api/logout', { method: 'POST' });
  await refreshSession();
  await navigateTo('/');
}
</script>

<template>
  <AuthState v-slot="{ loggedIn }">
    <form v-if="! loggedIn" @submit.prevent="login">
      <input v-model="credentials.username" type="text" placeholder="Username" />
      <input v-model="credentials.password" type="password" placeholder="Password" />
      <button type="submit">Login</button>
    </form>
    <button v-else @click="logout">Logout</button>
  </AuthState>
</template>
