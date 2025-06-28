<script setup lang="ts">

import {
  isLoginDocument,
  parseLoginBody,
  type LoginDocument
} from "~/types/UserTypes";
import {useFormErrors} from "~/composables/use-form-errors";

const {loggedIn, user, fetch: refreshSession, clear} = useUserSession()
const credentials = reactive({
  username: '',
  password: '',
});

const {errors, hasError, clearErrors, validate} = useFormErrors();

function validateForm() {
  return validate<LoginDocument,LoginDocument>(
      credentials,
      // @ts-ignore
      isLoginDocument,
      parseLoginBody
  );
}

async function login() {
  if (!validateForm()) {
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
        console.error(err);
        return;
      })
}

async function logout() {
  await $fetch('/api/logout', {method: 'POST'});
  await refreshSession();
  await navigateTo('/');
}

function focused(event: Event) {
  const target = event.target as HTMLElement;
  if (target.id && errors.length) {
    const path = target.id
    clearErrors(path);
  }
}

</script>

<template>
  <InfoPage :page_title="loggedIn ? 'Log out' : 'Log in'">
    <AuthState v-slot="{ loggedIn }">
      <div class="form-container">
        <form v-if="! loggedIn" @submit.prevent="login">
          <label class="form-label" :class="{ error: hasError('username') }" for="username">User name</label>
          <input class="form-input" :class="{ error: hasError('username') }"
                 v-model="credentials.username" type="text" id="username" placeholder="Username"
                 @focus="focused" @blur="validateForm"
          />
          <label class="form-label" :class="{ error: hasError('username') }" for="password">Password</label>
          <input class="form-input" :class="{ error: hasError('password') }"
                 v-model="credentials.password" type="password" id="password" placeholder="Password"
                 @focus="focused" @blur="validateForm"
          />
          <button type="submit">Login</button>
          <NuxtLink to="/register">Register new user</NuxtLink>
          <ul v-if="errors" class="errors">
            <template v-for="{message} of errors">
              <li>{{ message }}</li>
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
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  margin: 1rem;
}

form * {
  margin-bottom: 1rem;
  padding: 0.25rem;
}

form label {
  margin: 0;
  text-align: left;
  width: 100%;
}

form label.error {
  color: red;
  font-weight: bold;
}

form input.error {
  background-color: lightcoral;
  color: white;
}

form input.error::placeholder {
  color: lightgrey;
  font-weight: bold;
}

form input, form button {
  font-size: 1.5rem;
  width: 75%;
}

form button {
  margin-top: 1rem;
  width: inherit;
}

form a {
  width: inherit;
}

.errors {
  color: red;
  font-weight: bold;
  width: 30rem;
  font-size: 1.2rem;
}

</style>