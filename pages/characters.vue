<script setup lang="ts">
import {useCharactersStore} from "~/stores/use-characters-store";

const {characters} = useCharactersStore();

useSeoMeta({
  title: () => `Characters`,
})

function toLink(character) {
  if (character && character?.id) {
    return `/character/${character.id}`;
  }
}
</script>

<template>
  <InfoPage page_title="Characters">
    <table>
      <tbody>
      <tr v-if="characters.size" v-for="character in characters.values()" :key="character.id">
        <td>{{ character.id }}</td>
        <td>
          <NuxtLink v-if="toLink(character)" :to="toLink(character)">
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