<script setup lang="ts">

import {useCharactersStore} from "~/stores/use-characters-store";
import {useScenesStore} from "~/stores/use-scenes-store";

const route = useRoute();
const scenesStore = useScenesStore();

const scene = computed(() => {
  const sceneId = route.params.sceneId as string;
  return scenesStore.getScene(sceneId);
});

const page_title = computed(() => {
  return "Scene - " + scene.value?.title;
});

useSeoMeta({
  title: () => page_title.value,
});
</script>

<template>
  <InfoPage :page_title="page_title">
    <div v-if="scene" class="scene-container">
      <div class="scene-description">
        {{ scene.description }}
      </div>
      <div class="aspects-list">
        <div class="aspect-item" v-for="aspect in scene.aspects" >
          <Aspect :aspect="aspect" track-id="scene"/>
        </div>
      </div>
      <div class="character-item" v-for="character in scene.characters" >
        <CharacterCard :character="character" traits-view-type="pyramid" />
      </div>
    </div>
    <div v-else>Loading...</div>
  </InfoPage>

</template>

<style scoped>
.scene-container {
  width: 100cqw;
  height: 100cqh;
  display: grid;
  grid-template-columns: 1fr 2fr 2fr 2fr 2fr;
}
.scene-description {
  grid-column: 1 / 6;
}
.aspects-list {
  grid-column: 1 / 6;
}
.character-item {
  grid-column: 4 / 6;
}
</style>