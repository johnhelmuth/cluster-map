<script setup lang="ts">

import {useDiceStore} from "~/stores/use-dice-store";
import DiceRollResult from "~/components/dice-roller/dice-roll-result.vue";
import DiceRollControl from "~/components/dice-roller/dice-roll-control.vue";
import DiceLog from "~/components/dice-roller/dice-log.vue";

const diceService = useDiceStore()

function rollTheDice(diceExpr: string) {
  if (diceExpr) {
    diceService.rollDice(diceExpr);
  }
}

</script>

<template>

  <InfoPage page_title="Dice roller">
    <main>
      <section class="controls-section">
        <DiceRollControlFixed diceExpression="4dF" @roll-the-dice="rollTheDice" />
        <DiceRollControlFixed diceExpression="2d6" @roll-the-dice="rollTheDice" />
        <DiceRollControl @roll-the-dice="rollTheDice" />
      </section>
      <section class="section dice-roll-result">
        <DiceRollResult v-if="diceService.lastResult" :dice-roll="diceService.lastResult"/>
        <div v-else class="empty-dice-results"></div>
      </section>
      <section class="section dice-log-section">
        <DiceLog />
      </section>
    </main>
  </InfoPage>
</template>

<style scoped>

main {
  display: flex;
  flex-direction: column;
  justify-content: start;
  width: 100%;
  height: 100%;
}

section {
  flex: 0 1 auto;
  position: relative;
}

section.dice-log-section {
  flex: 2 1 auto;
}
.dice-roll-result .empty-dice-results {
  min-height: 3rem;
}

.dice-roll-result {
  margin: 2.5rem 2rem;
  padding: 1rem;
  box-shadow: inset -0.25rem -0.25rem 0.1rem #aaa,
  inset 0.25rem 0.25rem 0.1rem lightgrey;
  display: flex;
  justify-content: center;
  background-color: var(--color-background);
  font-size: 1.5rem;
}


.dice-log-section {
  container: log-section / size;
  max-height: 60cqh;
  margin: 1rem 2rem;
}
</style>