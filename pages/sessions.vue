<script setup lang="ts">

const route = useRoute()

const {data: sessions} = await useAsyncData(route.path, async () => {
  const data = await queryCollection('content')
      .select('id', 'title', 'description', 'path', 'meta', 'in_game_start', 'in_game_end')
      .where('path', 'LIKE', '/sessions/%')
      .where('path', 'NOT LIKE', '/sessions/%/%')
      .order('in_game_start', 'ASC')
      .all()
  ;
  return data;
});

</script>

<template>
  <InfoPage page_title="Sessions">
    <ul v-if="sessions && sessions.length > 0">
      <li key="header" class="header">
        <div class="session-title">Title</div>
        <div class="session-date">Session Date</div>
        <div class="session-game-range">In Game Time Range</div>
        <div class="session-description">Description</div>
      </li>
      <li v-for="session in sessions" :key="session.id">
        <div class="session-title">
          <NuxtLink :to="session.path">{{ session.title }}</NuxtLink>
        </div>
        <div class="session-date">{{ session.meta.date }}</div>
        <div class="session-game-range">{{ session.in_game_start }} - {{ session.in_game_end }}</div>
        <div class="session-description">{{ session.description }}</div>
      </li>
    </ul>
  </InfoPage>
</template>

<style scoped>
ul {
  padding-inline-start: 0;
}

li {
  list-style-type: none;
  display: grid;
  grid-template-areas:
     "title-link  session-date game-range"
     "description description  description";
  grid-template-columns: 2fr 1fr 3fr;
  grid-row-gap: 0.25rem;
  grid-column-gap: 0.25rem;
  font-size: 0.75rem;
  text-align: center;
  margin-bottom: 0.75rem;
}

li div {
  padding: 0.5rem;
  background-color: var(--color-background-mute);
  border-radius: 0.33rem;
}

li.header div {
  margin-bottom: 0;
}

li div.session-title {
  grid-area: title-link;
  text-align: left;
}

li div.session-date {
  grid-area: session-date;
}

li div.session-game-range {
  grid-area: game-range;
  text-align: right;
}

li div.session-description {
  grid-area: description;
  text-align: left;
}
</style>