<script setup lang="ts">


import type {CharacterData} from "~/types/character/CharacterTypes";
import {useCharactersStore} from "~/stores/use-characters-store";

const charactersStore = useCharactersStore();

useSeoMeta({
  title: () => `Characters`,
})
</script>

<template>
  <InfoPage page_title="Characters">
    <table>
      <tbody>
      <tr v-if="charactersStore.characters.size" v-for="character in charactersStore.characters.values()"
          :key="character.id">
        <td>{{ character.id }}</td>
        <td>
          <NuxtLink v-if="character.toLink()" :to="character.toLink()">
            {{ character.name }}
          </NuxtLink>
          <span v-else>{{ character.name }}</span>
        </td>
        <td>{{ character.description }}</td>
        <td>
          <ul v-if="character.aspects && character.aspects.length">
            <li v-for="aspect in character.aspects">
              <span v-if="aspect.aspectType">{{ aspect.aspectType }}: </span><strong>{{ aspect.name }}</strong>
            </li>
          </ul>
          <p v-else>No Aspects for character.</p>
        </td>
      </tr>
      </tbody>
    </table>
  </InfoPage>
</template>

<style scoped>

</style>