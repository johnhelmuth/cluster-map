<script setup lang="ts">

import {isLoginDocument, parseLoginBody} from "~/types/UserTypes";

const { loggedIn, user, fetch: refreshSession, clear } = useUserSession()
const credentials = reactive({
  username: '',
  password: '',
});
const errors = ref([]) as Ref<string[]>;

function setErrors(messages: string[]) {
  errors.value.splice(0, Infinity);
  errors.value.push(...messages)
}
async function login() {
  if (! isLoginDocument(credentials)) {
    const parseResult = parseLoginBody(credentials);
    console.log('errorparseResult: ', parseResult);
    if (parseResult?.error?.issues && parseResult?.error?.issues?.length > 0) {
      const messages = parseResult?.error?.issues?.map(issue => issue.message);
      if (messages?.length > 0) {
        setErrors(messages);
      }
    }
    return;
  }
  $fetch('/api/login', {
    method: 'POST',
    body: credentials
  })
      .then(async () => {
        // Refresh the session on client-side and redirect to the home page
        await refreshSession()
        await navigateTo('/')
      })
      .catch((err) => {
        setErrors([
            'Bad username or password.'
        ])
      })
}
async function logout() {
  await $fetch('/api/logout', { method: 'POST' });
  await refreshSession();
  await navigateTo('/');
}
</script>

<template>
  <InfoPage :page_title="loggedIn ? 'Log out' : 'Log in'">
    <AuthState v-slot="{ loggedIn }">
      <div class="form-container">
      <form v-if="! loggedIn" @submit.prevent="login">
        <label>
          User name
          <input v-model="credentials.username" type="text" placeholder="Username" />
        </label>
        <label>
          Password
          <input v-model="credentials.password" type="password" placeholder="Password" />
        </label>
        <button type="submit">Login</button>
        <ul v-if="errors.length" class="errors">
          <template v-for="error in errors">
            <li>{{ error }}</li>
          </template>
        </ul>
      </form>
        <button v-else @click="logout">Logout</button>
      </div>
    </AuthState>
  </InfoPage>
</template>

<style scoped>

.form-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
}
form {
  display: flex;
  flex-flow: column wrap;
  justify-content: space-between;
  align-items: center;
}

form * {
  margin: 1rem;
  padding: 0.25rem;
  width: 20rem;
}
form input, form button {
  font-size: 1.5rem;
}

form button {
  width: inherit;
}

.errors {
  color: red;
  font-weight: bold;
}
</style>