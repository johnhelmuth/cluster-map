<script setup lang="ts">

</script>

<template>
  <InfoPage page_title="Settings" max-width-rems="40">

    <main>
      <section class="settings">
        <h2>Settings</h2>
        <p>Things that change how the site works.</p>
        <p>Nothing right now. More to come!</p>
      </section>
    </main>
  </InfoPage>
</template>

<style scoped>

main {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

main section {
  margin: 1rem;
}

h2, h3 {
  font-weight: bold;
}

h3 {
  font-size: 1.1rem;
}

.actions {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
}

</style>
