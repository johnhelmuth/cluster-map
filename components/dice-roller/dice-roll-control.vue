<script setup lang="ts">

import type {DiceExpressionType} from "~/models/DiceService";

const emit = defineEmits<{
  'roll-the-dice': [expression: DiceExpressionType]
}>();

const diceExpression = ref('' as DiceExpressionType);

function rollTheDice(e: Event) {
  emit('roll-the-dice', diceExpression.value);
  e.preventDefault();
}

</script>

<template>
  <form name="roll-dice-expression" @submit="rollTheDice">
    <label for="dice-expression">
      Dice:
    </label>
    <input type="text" name="dice-expression" id="dice-expression" class="dice-expression"
           v-model="diceExpression"/>
    <button type="submit" value="expression">Roll the dice</button>
  </form>
</template>

<style scoped>


form {
  display: flex;
  flex-direction: row;
  gap: .5rem;
  font-size: 1.2rem;
  padding: 0.5rem;
  margin: auto 2rem;
}

form:first-child {
  margin-top: 2rem;
}

form .dice-expression {
  width: 100%;
  font-size: 1.2rem;
  padding: .25rem;
}

</style>