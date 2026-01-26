<script setup lang="ts">

import {dateTimeFormat} from "~/utils/utils";
import DiceRollResult from "~/components/dice-roller/dice-roll-result.vue";
import {useDiceStore} from "~/stores/use-dice-store";

const diceService = useDiceStore();

const diceLog = useTemplateRef('dice-log');

function clearDiceLog() {
  diceService.clearDiceLog();
}

watch(diceService.diceLog, () => {
  if (diceLog.value) {
    const lastLogEntry = diceLog.value.querySelector('li:last-child');
    if (lastLogEntry) {
      lastLogEntry.scrollIntoView({ behavior: 'smooth'});
    }
  }
})

</script>

<template>
  <div class="dice-log-container" ref="dice-log-container">
    <button class="button-clear-log" @click="clearDiceLog">Clear</button>
    <div class="dice-log-wrapper">
      <div class="roll-log-header">
        <div class="roll-dice">Dice</div>
        <div>Dice total</div>
        <div>Mod</div>
        <div>Total</div>
        <div>Ladder</div>
        <div class="roll-description-header">Description</div>
      </div>
      <ul class="dice-log" ref="dice-log">
        <li v-for="(log, index) in diceService.diceLog" class="roll-log-entry" :key="index">
          <DiceRollResult :dice-roll="log.diceRoll" :log-entry-time="dateTimeFormat(new Date(log.timestamp))" in-table/>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>

.dice-log-container {
  height: 100cqh;
  max-height: 100cqh;
  border: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: start;
  flex-direction: column;
  position: relative;
}

.button-clear-log {
  position: absolute;
  top: 1rem;
  right: 1rem;
  justify-self: flex-end;
  align-self: flex-end;
}

.dice-log-wrapper {
  display: grid;
  grid-template-columns: min-content 4rem min-content max-content 7rem minmax(min-content, max-content);
  grid-template-rows: minmax(min-content, max-content);
  grid-template-areas: "dice dicetotal modifier total adjective description";
  justify-content: start;
  margin-top: 1rem;
}

.roll-log-header {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: subgrid;
  grid-template-rows: subgrid;
  align-items: end;
  justify-content: center;
  gap: .75rem;
  padding-bottom: .5rem;
  border-bottom: 1px solid var(--color-border);
}

.roll-log-header > * {
  font-weight: bold;
  justify-self: center;
}

.roll-log-header .roll-description-header {
  justify-self: start;
  margin-left: .75rem;
}

ul.dice-log {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: subgrid;
  grid-auto-rows: minmax(2rem, max-content);
  gap: 0.75rem;
  align-items: end;
  padding: 0 1rem 1rem;
  height: 87cqh;
  overflow-y: auto;
  scrollbar-color: initial;
}

li.roll-log-entry {
  grid-column: 1/-1;
  display: grid;
  grid-template-columns: subgrid;
}

li.roll-log-entry > * {
  margin-right: 0.5rem;
}

@container (width < 450px) {
  ul.dice-log {
    padding-top: 3rem;
  }
}

@container (width < 600px) {
  ul.dice-log {
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr;
    row-gap: 0;
    grid-template-areas:  "dice        dicetotal   blank"
                          "modifier    total       adjective"
                          "description description description";
    grid-auto-rows: minmax(2rem, auto) minmax(2rem, auto) minmax(2rem, auto);
  }

  .roll-log-header {
    display: none;
  }

  li.roll-log-entry {
    margin-bottom: .75rem;
    padding-bottom: .75rem;
    border-bottom: 0.5px solid var(--color-border);
  }
}

</style>