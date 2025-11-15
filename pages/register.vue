<script setup lang="ts">
import {isRegisterDocument, parseRegisterBody, type RegisterDocument} from "~/types/UserTypes";
import type {Reactive} from "vue";
import {useFormErrors} from "~/composables/use-form-errors";

definePageMeta({
  middleware: ['unauthenticated'],
});

const {fetch: refreshSession} = useUserSession()

const registration = reactive({
  name: '',
  username: '',
  email: '',
  password: '',
  passwordConfirmed: '',
}) as Reactive<RegisterDocument>;

const {errors, hasError, clearErrors, validate} = useFormErrors();

function validateForm() {
  return validate<RegisterDocument,RegisterDocument>(
      registration,
      // @ts-ignore
      isRegisterDocument,
      parseRegisterBody
  );
}

async function register() {
  console.log('registration: ', registration);
  if (!validateForm()) {
    return;
  }
  try {
    await $fetch('/api/register', {
      method: 'POST',
      body: registration,
    });
  } catch (error) {
    console.error(error);
    return;
  }
  await refreshSession();
  await navigateTo('login');
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
  <InfoPage page_title="Register">
    <div class="form-container">
      <form @submit.prevent="register">
        <label class="form-label" :class="{ error: hasError('name') }" for="name">Name</label>
        <input class="form-input" :class="{ error: hasError('name') }"
               v-model="registration.name" type="text" id="name"
               placeholder="Name" @focus="focused" @blur="validateForm"
        />
        <label class="form-label" :class="{ error: hasError('username') }" for="username">User name</label>
        <input class="form-input" :class="{ error: hasError('username') }"
               v-model="registration.username" type="text" id="username"
               placeholder="Username" @focus="focused" @blur="validateForm"
        />
        <label class="form-label" :class="{ error: hasError('email') }" for="email">Email</label>
        <input class="form-input" :class="{ error: hasError('email') }"
               v-model="registration.email" type="text" id="email"
               placeholder="Email address" @focus="focused" @blur="validateForm"
        />
        <label class="form-label" :class="{ error: hasError('password') }" for="password">Password</label>
        <input class="form-input" :class="{ error: hasError('password') }"
               v-model="registration.password" type="password" id="password"
               placeholder="Password" @focus="focused" @blur="validateForm"
        />
        <label class="form-label" :class="{ error: hasError('passwordConfirmed') }" for="passwordConfirmed">Confirm
          password</label>
        <input class="form-input" :class="{ error: hasError('passwordConfirmed') }"
               v-model="registration.passwordConfirmed" type="password" id="passwordConfirmed"
               placeholder="Confirm password" @focus="focused" @blur="validateForm"
        />
        <button type="submit">Register</button>
        <NuxtLink to="/login">Login</NuxtLink>
        <ul v-if="errors" class="errors">
          <template v-for="{message} of errors">
            <li>{{ message }}</li>
          </template>
        </ul>
      </form>
    </div>
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