<script setup lang="ts">

import {useDiceStore} from "~/stores/use-dice-store";
import {dateTimeFormat} from "~/utils/utils";
import DiceRollResult from "~/components/dice-roll-result.vue";

const diceService = useDiceStore()

const diceExpression = ref('');

const description4df = ref('');
const modifier4df = ref('');
const modifier4dfRef = useTemplateRef('modifier-4df');

const description2d6 = ref('')
const modifier2d6 = ref('');

onMounted(() => {
  modifier4dfRef.value?.focus();
})

function rollTheDice(e: Event, diceExpr: string) {
  switch (diceExpr) {
    case '4df':
      const modifier = parseInt(modifier4df.value);
      if (!isNaN(modifier) && modifier) {
        if (modifier > 0) {
          diceExpr += '+' + modifier.toString();
        } else {
          diceExpr += modifier.toString();
        }
      }
      diceExpr += ' ' + description4df.value;
      break;
    case '2d6':
      if (modifier2d6.value) {
        const modifier = parseInt(modifier2d6.value);
        if (!isNaN(modifier) && modifier) {
          if (modifier > 0) {
            diceExpr += '+' + modifier.toString();
          } else {
            diceExpr += modifier.toString();
          }
        }
      }
      diceExpr += ' ' + description2d6.value;
      break;
    case 'expression':
      diceExpr = diceExpression.value;
      break;
  }
  console.log('diceExpr', diceExpr);
  if (diceExpr) {
    diceService.rollDice(diceExpr);
    diceExpression.value = '';
    description4df.value = '';
    description2d6.value = '';
  }
  modifier4dfRef.value?.focus();
  e.preventDefault();
}

function clearDiceLog() {
  diceService.clearDiceLog();
}

</script>

<template>

  <InfoPage page_title="Dice roller">
    <main>
      <section class="controls-section">
        <form name="roll-4df" @submit="(e) => rollTheDice(e, '4df')">
          <button type="submit">Roll 4dF</button>
          <label for="modifier-4df">
            Modifier:
          </label>
          <input type="text" name="dice-modifier" ref="modifier-4df" id="modifier-4df" class="roll-modifier 4df"
                 v-model="modifier4df"/>
          <label for="description-4df">
            Description:
          </label>
          <input type="text" name="dice-description" id="description-4df" class="roll-description 4df"
                 v-model="description4df"/>
        </form>
        <form name="roll-2d6" @submit="(e) => rollTheDice(e, '2d6')">
          <button type="submit" value="2d6">Roll 2d6</button>
          <label for="modifier-2d6">
            Modifier:
          </label>
          <input type="text" name="dice-modifier" id="modifier-2d6" class="roll-modifier 2d6" v-model="modifier2d6"/>
          <label for="description-2d6">
            Description:
          </label>
          <input type="text" name="dice-description" id="description-2d6" class="roll-description 2d6"
                 v-model="description2d6"/>
        </form>
        <form name="roll-dice-expression" @submit="(e) => rollTheDice(e, 'expression')">
          <label for="dice-expression">
            Dice:
          </label>
          <input type="text" name="dice-expression" id="dice-expression" class="dice-expression"
                 v-model="diceExpression"/>
          <button type="submit" value="expression">Roll the dice</button>
        </form>
      </section>
      <section class="section dice-roll-result">
        <DiceRollResult v-if="diceService.lastResult" :dice-roll="diceService.lastResult"/>
        <div v-else class="empty-dice-results"></div>
      </section>
      <section class="section dice-log-section">
        <button class="button-clear-log" @click="clearDiceLog">Clear</button>
        <ul class="dice-log">
          <li class="roll-log-header">
            <div>Timestamp</div>
            <div>Dice</div>
            <div>Dice total</div>
            <div>Mod</div>
            <div>Total</div>
            <div class="roll-description-header">Description</div>
          </li>
          <li v-for="log in diceService.diceLog" class="roll-log-entry">
            <div class="timestamp">{{ dateTimeFormat(new Date(log.timestamp)) }}</div>
            <DiceRollResult :dice-roll="log.diceRoll" in-table/>
          </li>
        </ul>
      </section>
    </main>
  </InfoPage>
</template>

<style scoped>

main {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  width: 100%;
}

section {
  flex: 0 1 auto;
}

section.dice-log-section {
  flex: 2 1 auto;
  overflow-y: scroll;
}

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

.dice-roll-result .empty-dice-results {
  min-height: 1.75rem;
}

.dice-roll-result {
  margin: 3rem 2rem;
  padding: 2rem;
  box-shadow: inset -0.25rem -0.25rem 0.25rem #777,
  inset 0.25rem 0.25rem 0.25rem lightgrey;
  display: flex;
  justify-content: center;
  background-color: var(--color-background);
  font-size: 1.5rem;
}

.dice-roll-result :deep(.dice-roll-results .roll-dice) {
  grid-template-columns: repeat(auto-fit, 2rem);
  max-width: 10rem;
}

.dice-log-section {
  position: relative;
  margin: 2rem;
  border: 1px solid var(--color-border);

}

.button-clear-log {
  position: absolute;
  top: 1rem;
  right: 1rem;
}

ul.dice-log {
  display: grid;
  grid-template-columns: 12rem 8rem 3rem 3rem 3rem auto;
  grid-auto-rows: auto;
  grid-row-gap: 0.75rem;
}

li.roll-log-entry, li.roll-log-header {
  grid-column: 1/-1;
  display: grid;
  grid-template-columns: subgrid;
  justify-items: center;
  align-items: end;
}

li.roll-log-header > * {
  font-weight: bold;
}

li.roll-log-entry > * {
  margin-right: 0.5rem;
}

li.roll-log-header .roll-description-header {
  justify-self: start;
  margin-left: .75rem;
}
</style>