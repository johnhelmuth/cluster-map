<script setup lang="ts">

import {getLadderDescription} from "~/utils/utils";
import type {DiceRollInterface, DieType} from "~/models/DiceService";

defineProps<{
  diceRoll: DiceRollInterface | undefined,
  logEntryTime?: string,
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
  <div v-if="diceRoll" class="dice-roll-results"
       :class="{ 'in-table': inTable, [`die-type-${diceRoll.parsedRoll.dieType}`]: true, 'has-log-entry-time': !!logEntryTime }"
       :title="`${logEntryTime ? 'Rolled at ' + logEntryTime : ''}`"
  >
    <div class="roll-dice">
      <template v-for="(rollDie, index) of diceRoll.diceResults" :key="index">
        <div class="roll-die" :class="`roll-die-${index}`">{{
            formatDieByType(diceRoll.parsedRoll.dieType, rollDie)
          }}
        </div>
      </template>
    </div>
    <div class="roll-dice-total">= <span class="dice-roll-total-value">{{ totalDice(diceRoll.diceResults) }}</span></div>
    <div class="roll-modifier">{{
        diceRoll.parsedRoll.modifier ? formatRollModifier(diceRoll.parsedRoll.modifier) : ''
      }}
    </div>
    <div class="roll-total"
         :title="(diceRoll.parsedRoll.dieType === 'fudge' ? getLadderDescription(diceRoll.diceTotal) : '')">
      = <span class="roll-total-value">{{ diceRoll.diceTotal }}</span>
    </div>
    <div v-if="diceRoll.parsedRoll.dieType === 'fudge'" class="ladder-adj">
      {{ getLadderDescription(diceRoll.diceTotal) }}
    </div>
    <div class="roll-description">
      {{ diceRoll.parsedRoll.description }}
    </div>
  </div>
</template>

<style scoped>

.dice-roll-results {
  --dice-size-multiplier: 1;
  --remPixels: 1rem;
  align-items: center;
  justify-items: center;
  min-height: 3rem;
}
.dice-roll-results:not(.in-table) {
  --dice-size-multiplier: 1.5;
  display: grid;
  grid-template-columns: min-content 4rem max-content 5rem 7rem minmax(min-content, max-content);
  grid-template-rows: minmax(min-content, max-content);
  grid-template-areas: "dice dicetotal modifier total adjective description";
  grid-auto-rows: auto;
}
.dice-roll-results.in-table {
  grid-column: 1/-1;
  grid-row: 1/4;
  display: grid;
  grid-template-columns: subgrid;
  grid-template-rows: subgrid;
}

.dice-roll-results:not(.in-table) .roll-dice {
  grid-template-columns: repeat(auto-fit, calc(var(--dice-size-multiplier) * var(--remPixels)));
  max-width: calc(var(--dice-size-multiplier) * 5 * var(--remPixels));
}

.dice-roll-results .roll-dice {
  grid-template-columns: repeat(auto-fit, calc(var(--dice-size-multiplier) * var(--remPixels)));
  max-width: calc(var(--dice-size-multiplier) * 5 * var(--remPixels));
  grid-area: dice;
  display: grid;
  grid-auto-flow: row;
  justify-items: center;
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

.dice-roll-results .roll-dice-total {
  grid-area: dicetotal;
}
.dice-roll-results .roll-dice-total > .dice-roll-total-value {
  font-weight: bold;
  font-style: italic;
  font-size: 120%
}

.dice-roll-results .roll-modifier {
  grid-area: modifier;
}
.dice-roll-results .roll-total {
  grid-area: total;
}
.dice-roll-results .ladder-adj {
  grid-area: adjective;
  font-weight: bold;
}
.dice-roll-results .roll-total > .roll-total-value {
  font-weight: bold;
  font-size: 120%
}

.dice-roll-results .roll-description {
  grid-area: description;
  justify-self: start;
  margin-left: .75rem;
}

@container (width < 600px) {
  .dice-roll-results:not(.in-table),
  .dice-roll-results.in-table {
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-areas:  "dice        dicetotal   blank"
                          "modifier    total       adjective"
                          "description description description";
    grid-auto-rows: auto;
    gap: 0.75rem;
  }
}
</style>