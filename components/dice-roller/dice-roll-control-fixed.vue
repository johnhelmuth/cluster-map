<script setup lang="ts">

import type {DiceExpressionType} from "~/models/DiceService";

const props = defineProps<{
  diceExpression: string
}>();

const emit = defineEmits<{
  'roll-the-dice': [expression: DiceExpressionType]
}>();

const modifier = ref(undefined as number|undefined);
const description = ref(undefined as string|undefined);

const modifierId = computed(() => `modifier-${props.diceExpression}`)
const descriptionId = computed(() => `description-${props.diceExpression}`)

function rollTheDice(e: Event) {
  let diceExpression = props.diceExpression;
  if (modifier.value) {
    diceExpression += modifier.value.toString().replace(/\s*/g, '');
  }
  if (description.value) {
    diceExpression += description.value.toString().replace(/^\s*/, '').replace(/\s*$/, '');
  }
  emit('roll-the-dice', diceExpression)
  e.preventDefault();
}

</script>

<template>
  <form v-if="diceExpression" :name="`roll-${diceExpression}`" @submit="rollTheDice">
    <label :for="descriptionId">
      Description:
    </label>
    <input type="text" name="dice-description" :id="descriptionId" class="roll-description"
           v-model="description" />
    <label :for="modifierId">
      Modifier:
    </label>
    <input type="text" name="dice-modifier" :id="modifierId" class="roll-modifier"
           v-model="modifier" />
    <button type="submit">Roll {{ diceExpression }}</button>
  </form>
  <div v-else>No or empty dice expression passed to control.</div>
</template>

<style scoped>

form {
  display: flex;
  flex-direction: row;
  gap: .5rem;
  font-size: 1.2rem;
  padding: 0.5rem;
  margin: auto 2rem;
  justify-content: space-between;
}
input.roll-description {
  flex: 2 0 auto;
}
input.roll-modifier {
  flex: 0 2 auto;
  width: 4rem;
}
form:first-child {
  margin-top: 2rem;
}

</style>