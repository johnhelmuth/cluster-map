<script setup lang="ts">

const props = defineProps({
  "character": { "name": String, "description": String, "traits": Array, "stunts": Array },
});


function traitLabel(traitType: string) {
  let label;
  switch (traitType) {
    case "skill":
      label = "Skills";
      break;
    case "approach":
      label = "Approaches";
      break;
    case "profession":
      label = "Professions";
    default:
      label = "Traits"
  }
  return label;
}

onMounted(() => {
  console.log(props);
})

</script>

<template>
  <h2>{{ character.name }}</h2>
  <div v-if="character.description">
    <p>{{ character.description }}</p>
  </div>
  <div v-if="character.aspects && character.aspects.length">
    <h3>Aspects</h3>
    <ul>
      <li v-for="aspect in character.aspects">
        <span v-if="aspect.aspectType">{{ aspect.aspectType }}: </span><strong>{{ aspect.name }}</strong>
      </li>
    </ul>
  </div>
  <div v-if="character.traits.length">
    <h3>{{ traitLabel(character.traitType || '') }}</h3>
    <ul class="trait-list">
      <li class="trait-item" v-for="trait in character.traits">
        <span>{{ trait.name }}: </span><span><strong>{{ trait.rank }}</strong></span>
      </li>
    </ul>
  </div>
  <div v-if="character.stunts && character.stunts.length">
    <h3>Stunts</h3>
    <ul>
      <li v-for="stunt in character.stunts">
        <h4>{{ stunt.name }}</h4>
        <p>{{ stunt.description }}</p>
      </li>
    </ul>
  </div>
</template>

<style scoped>

h4 {
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.trait-list {
  width: 10rem;
}

.trait-item {
  display: flex;
  justify-content: flex-end;
  column-gap: 1rem;
}

strong {
  font-weight: bold;
  font-style: italic;
}
</style>