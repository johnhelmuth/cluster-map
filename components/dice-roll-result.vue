<script setup lang="ts">

import {getLadderDescription} from "~/utils/utils";
import type {DiceRollInterface, DieType} from "~/models/DiceService";

defineProps<{
  diceRoll: DiceRollInterface | undefined,
  inTable?: boolean,
}>();

function totalDice(diceResult: number[] | undefined): number {
  if (Array.isArray(diceResult)) {
    return diceResult.reduce((acc, el) => acc + el, 0);
  } else {
    return 0;
  }
}

function formatRollModifier(mod: number) {
  if (mod > 0) {
    return '+' + mod.toString();
  } else if (mod < 0) {
    return '-' + Math.abs(mod).toString();
  }
  return '0';
}

function formatDieByType(dieType: DieType, dieValue: number) {
  let dieValFormatted = dieValue.toString();
  if (typeof dieType !== 'number') {
    switch (dieType) {
      case "fudge":
        if (dieValue < 0) {
          dieValFormatted = '-';
        } else if (dieValue > 0) {
          dieValFormatted = '+';
        } else {
          dieValFormatted = '0';
        }
    }
  } else if (dieType === 6) {
    dieValFormatted = String.fromCharCode(65 + dieValue - 1);
    // dieValFormatted = String.fromCharCode(97 + dieValue - 1); // For white dice with black pips.
  }
  return dieValFormatted;
}
</script>

<template>
  <div v-if="diceRoll" class="dice-roll-results" :class="{ 'in-table': inTable, [`die-type-${diceRoll.parsedRoll.dieType}`]: true }">
    <div class="roll-dice">
      <template v-for="(rollDie, index) of diceRoll.diceResults" :key="index">
        <div class="roll-die" :class="`roll-die-${index}`">{{
            formatDieByType(diceRoll.parsedRoll.dieType, rollDie)
          }}
        </div>
      </template>
    </div>
    <div class="roll-dice-total">= {{ totalDice(diceRoll.diceResults) }}</div>
    <div class="roll-modifier">{{
        diceRoll.parsedRoll.modifier ? formatRollModifier(diceRoll.parsedRoll.modifier) : ''
      }}
    </div>
    <div class="roll-total"
         :title="(diceRoll.parsedRoll.dieType === 'fudge' ? getLadderDescription(diceRoll.diceTotal) : '')">
      = <span class="roll-total-value">{{ diceRoll.diceTotal }}</span>
    </div>
    <div class="roll-description">
      {{ diceRoll.parsedRoll.description }}
      <span v-if="diceRoll.parsedRoll.dieType === 'fudge'" class="ladder-adj">{{ getLadderDescription(diceRoll.diceTotal) + '! ' }}</span>
    </div>
  </div>
</template>

<style scoped>

.dice-roll-results:not(.in-table) {
  display: grid;
  grid-template-columns: 12rem 3rem 3rem 3rem auto;
  grid-auto-rows: auto;
  grid-row-gap: 0.75rem;
  align-items: center;
}
.dice-roll-results.in-table {
  grid-column: 2/-1;
  display: grid;
  grid-template-columns: subgrid;
  justify-items: center;
  align-items: end;
}

.dice-roll-results:not(.in-table) .roll-dice {
  max-width: 8rem;
}

.dice-roll-results .roll-dice {
  max-width: 5rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, 1rem);
  grid-auto-flow: row;
  justify-content: space-between;
  align-items: center;
  column-gap: .25rem;
}

.dice-roll-results .roll-dice .roll-die {
  max-width: 1rem;
}

.dice-roll-results.die-type-fudge .roll-dice .roll-die {
  font-family: 'Fate Core', monospace;
}

.dice-roll-results.die-type-6 .roll-dice .roll-die {
  font-family: 'ArtsD6Pipped', monospace;
  font-size: 1.4rem;
  line-height: 1;
}

.dice-roll-results .roll-total > .roll-total-value {
  font-weight: bold;
}

.dice-roll-results .roll-description .ladder-adj {
  font-weight: bold;
}
.dice-roll-results .roll-description, li.roll-log-header .roll-description {
  justify-self: start;
  margin-left: .75rem;
}

</style>