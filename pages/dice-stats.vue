<script setup lang="ts">

import type {ReportForDieTypeInterface} from "~/models/DiceService";
import {useDiceStore} from "~/stores/use-dice-store";
import LineChart from "~/components/chart-components/line-chart.vue";
import BarChart from "~/components/chart-components/bar-chart.vue";

const diceService = useDiceStore()

const diceStatsReport = ref(undefined as ReportForDieTypeInterface | undefined);

const chartType = ref('line-chart' as 'line-chart' | 'bar-chart');

const rngToUse = ref(diceService.RNGDefault);

function runStats(e: Event, expression: string) {
  const btn = e.target as HTMLButtonElement;
  if (btn) {
    btn.setAttribute("disabled", "disabled");
  }
  console.log('runStats() rngToUse.value', rngToUse.value);
  diceStatsReport.value = diceService.runDiceForStats(expression, undefined, rngToUse.value);
  if (btn) {
    btn.removeAttribute("disabled");
  }
}

const statsData = computed(() => {
  if (diceStatsReport.value) {
    const totalCount = diceStatsReport.value.count;
    return diceStatsReport.value.reportForResult.map(({result, count}) => {
      return {label: result, value: count}
    })
  }
})

const numFmt3 = new Intl.NumberFormat(undefined, {
  style: "decimal",
  minimumFractionDigits: 3,
  maximumFractionDigits: 3
});

const numFmtInt = new Intl.NumberFormat(undefined, {
  style: "decimal",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0
});

const numFmtPercent = new Intl.NumberFormat(undefined, {
  style: "percent",
  minimumFractionDigits: 3,
  maximumFractionDigits: 3
});

function formatNumber(num: number) {
  return numFmt3.format(num);
}

function formatNumberInt(num: number) {
  return numFmtInt.format(num);
}

function formatNumberPercent(num: number) {
  return numFmtPercent.format(num);
}
</script>

<template>
  <InfoPage page_title="Dice Stats">
    <div class="stats">
      <nav class="dice-button-list">
        <button class="run-stats" @click="(e) => runStats(e,'4df')">Stats for 4df</button>
        <button class="run-stats" @click="(e) => runStats(e,'2d6')">Stats for 2d6</button>
        <button class="run-stats" @click="(e) => runStats(e,'3d6')">Stats for 3d6</button>
        <button class="run-stats" @click="(e) => runStats(e,'1d20')">Stats for 1d20</button>
      </nav>
      <fieldset class="rng-control">
        <legend>Random Number Generator</legend>
        <label>
          <input type="radio" name="rng-type" value="chance" v-model="rngToUse">
          Chance RNG library
        </label>
        <label>
          <input type="radio" name="rng-type" value="myRand" v-model="rngToUse">
          My Library Web.Crypto()
        </label>
      </fieldset>
      <nav class="chart-controls-list">
        <label class="chart-type-widget">
          <span>Line chart</span>
          <input class="chart-type" type="radio" name="chart-type" value="line-chart" v-model="chartType">
        </label>
        <label class="chart-type-widget">
          <span>Bar chart</span>
          <input class="chart-type" type="radio" name="chart-type" value="bar-chart" v-model="chartType">
        </label>
      </nav>
      <component :is="chartType === 'line-chart' ? LineChart : BarChart" class="stats-chart" v-if="statsData" :statsData="statsData" :viewBox="[0, 0, 1000, 1000]"/>
      <table v-if="diceStatsReport" class="stats-report-table">
        <thead>
        <tr>
          <th>Result</th>
          <th>Count</th>
          <th>%</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="({ result, count }, idx) in diceStatsReport.reportForResult" class="result-row">
          <td>{{ result }}</td>
          <td>{{ formatNumberInt(count) }}</td>
          <td>{{ formatNumberPercent(count / diceStatsReport.count) }}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </InfoPage>
</template>

<style scoped>

div.stats {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: max-content max-content max-content 1fr;
  grid-template-areas: "dice-control dice-control"
                       "rng-control  rng-control"
                       "chart-type   blank"
                       "chart        table";
  justify-content: space-around;
  align-items: start;
  gap: 1rem;
}

.dice-button-list {
  grid-area: dice-control;
  display: flex;
}
.rng-control {
  grid-area: rng-control;
  display: flex;
  justify-content: space-around;
}
.rng-control input {
  margin-left: 0.25rem;
}
.chart-controls-list {
  grid-area: chart-type;
  display: flex;
}

button.run-stats {
  width: max-content;
  margin: auto;
}
button.run-stats:disabled {
  border: 5px solid purple;
}

label.chart-type-widget {
  width: max-content;
  margin: auto;
}

label.chart-type-widget span {
  margin-right: 1rem;
}

table.stats-report-table {
  grid-area: table;
  margin-top: 0;
}

td {
  text-align: right;
}

.stats-chart {
  grid-area: chart;
  display: block;
  width: 50cqw;
  height: 50cqw;
  border: 1px solid var(--color-border);
}

</style>