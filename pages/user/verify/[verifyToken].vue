<script setup lang="ts">

const route = useRoute();

const { user, fetch: refreshSession } = useUserSession();

const {data: response} = await useAsyncData(`verify-${route.params.verifyToken}`, async () => {
  const vt = route.params.verifyToken;
  const response = useRequestFetch()(`/api/user/verify/${vt}`, {})
  console.log('verifyToken page api/user/verify/[VT] response: ', response);
  return response;
});

watch(user, () => {
  console.log('watch user: current user: ', user);
})
</script>

<template>
  <div>
    <InfoPage page_title="Verify email">
      <div>
        <template v-if="response">
          <div :class="response.verifyResult ? 'verified' : 'not-verified'">
            {{ response.message }}
          </div>
        </template>
        <template v-else>
          <div>
            <span class="error">Something failed when verifying email.</span>
          </div>
        </template>
        <pre>User: {{ user }}</pre>
        <pre>response: {{ response }}</pre>
        <ul class="links">
          <li>
            <NuxtLink :to="{ name: 'index' }">Home</NuxtLink>
          </li>
          <li v-if="! user">
            <NuxtLink :to="{ name: 'login' }">Login</NuxtLink>
          </li>
        </ul>
      </div>
    </InfoPage>
  </div>
</template>

<style scoped>
.verified {
  border: green solid 1px;
}

.not-verified {
  font-style: italic;
  font-size: 1.2rem;
}

.error {
  color: red;
}
</style>