<script setup lang="ts">

import {useScenesStore} from "~/stores/use-scenes-store";

const scenesStore = useScenesStore();

useSeoMeta({
  title: () => `Scenes`,
})
</script>

<template>
  <InfoPage page_title="Scenes">
    <table>
      <tbody>
      <tr v-if="scenesStore.scenes.size" v-for="scene in scenesStore.scenes.values()"
          :key="scene.id">
        <td>{{ scene.id }}</td>
        <td>
          <NuxtLink v-if="scene.toLink()" :to="scene.toLink()">
            {{ scene.title }}
          </NuxtLink>
          <span v-else>{{ scene.title }}</span>
        </td>
        <td>{{ scene.description }}</td>
        <td>
          <ul v-if="scene.aspects && scene.aspects.length">
            <li v-for="aspect in scene.aspects">
              <strong>{{ aspect.name }}</strong>
            </li>
          </ul>
          <p v-else>No Aspects for scene.</p>
        </td>
        <td>
          <ul v-if="scene.numCharacters">
            <li v-for="character in scene.characters">
              <NuxtLink :v-if="character?.toLink()" :to="character.toLink()" >
                {{ character?.name }}
              </NuxtLink>
            </li>
          </ul>
          <p v-else>No Characters for scene.</p>
        </td>
      </tr>
      </tbody>
    </table>
  </InfoPage>
</template>

<style scoped>

</style>