<script setup lang="ts">

// TODO: Implement authorization so that only admin can see this page.
// TODO: Implement some sort of user grouping with permissions so you can see
//       other users in your group on this page.
import type {UserMetadataData} from "~/server/document-models/UserAuthDataDocument";

definePageMeta({
  middleware: ['authenticated'],
});

const { status, error, data: users } = await useFetch('/api/users')

</script>

<template>
  <InfoPage page_title="Users">
    <ul v-if="status == 'success'" v-for="user in users">
      <li>
        {{ user.id }} - {{ user.name }}
        <ul v-if="user.authenticationData.length">
          <li v-for="authData in user.authenticationData">
            <p v-if="authData?.authType == 'username-password'">
              {{ authData.id }} {{ authData.username }} (password)
            </p>
          </li>
        </ul>
      </li>
    </ul>
    <pre v-if="status == 'error'">{{ error }}</pre>
    <pre v-if="status == 'pending'">Loading...</pre>
  </InfoPage>
</template>

<style scoped>

</style>