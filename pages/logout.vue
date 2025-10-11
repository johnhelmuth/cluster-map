<script setup lang="ts">

const { clear } = useUserSession();

async function logout() {
  $fetch('/api/logout', {
    method: 'POST'
  })
      .then(async () => {
        // Refresh the session on client-side and redirect to the home page
        await clear()
        await navigateTo('/')
      })
}

onMounted(() => {
  logout()
})
</script>

<template>
  <div>
    Logging you out.
  </div>
</template>

<style scoped>

</style>