<script setup lang="ts">

import {TokenModel} from "~/models/TokenModel";

const route = useRoute();

const {data, error } = await useAsyncData('token', async () => {
  return $fetch('/api/user/token/681d2be66ddb619240513dab?token-type=reset');
});

const token = computed(() => {
  console.log('computed token() data.value: ', data.value)
  if (data) {
    return new TokenModel(data.value);
  }
})

const timestamp = computed(() => {
  return token.value.expiry.getTime();
})

const utc = computed(() => {
  return token.value.expiry.toUTCString();
})
</script>

<template>
  <div>
    Data:
    <pre>
      {{ token }}
    </pre>
    Timestamp: <pre>{{ timestamp }}</pre>
    utc: <pre>{{ utc }}</pre>
    Error:
    <pre>{{ error }}</pre>
  </div>
</template>

<style scoped>

</style>