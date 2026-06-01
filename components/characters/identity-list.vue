<script setup lang="ts">

const props = defineProps<{
  "name": string,
  "description"?: string,
  "playerName"?: string
}>();
</script>

<template>
  <div class="identity-list" :class="{ 'full-width-name': ! playerName}">
    <h2 class="character-name">{{ name }}</h2>
    <div v-if="playerName" class="player-name">
      <p>Player: {{ playerName }}</p>
    </div>
    <div v-if="description" class="character-description">
      <p>{{ description }}</p>
    </div>
  </div>
</template>

<style scoped>

div.identity-list {
  display: grid;
  grid-template-areas: "charname charname playername"
                       "description description description";
  grid-template-rows: minmax(min-content, 3rem) minmax(1.5rem, max-content);
}
div.identity-list.full-width-name {
  grid-template-areas: "charname charname charname"
                       "description description description";
}

@container (width < 30rem) {
  div.identity-list {
    grid-template-areas: "charname"
                         "playername"
                         "description";
    grid-template-rows: minmax(min-content, 3rem) minmax(min-content, 1rem) minmax(1.5rem, max-content)
  }

  div.identity-list .player-name {
    text-align: left;
  }
}

.character-name {
  grid-area: charname;
  max-height: 1rem;
}
.player-name {
  grid-area: playername;
  text-align: right;
}
.character-description {
  grid-area: description;
}
</style>