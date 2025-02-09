<script setup lang="ts">

import type {
  RandomChoiceItemThresholdType,
  RandomChoiceItemType, RandomTableType, RandomValueType,
  ResultsLine
} from "~/types/RandomTableTypes";
import RandomResultLog from "~/components/random-result-log.vue";

const resultsLog = ref<ResultsLine[]>([]);

const {data} = await useAsyncData('random-tables-list', async () => {
  console.log('/random-tables.vue getting all random-tables.');
  let data = await queryCollection('randomTables').all();
  console.log('/random-tables.vue all random-tables data: ', data);
  return data;
});

onMounted(() => {
  console.log('/random-tables.vue onMounted data.value: ', data.value);
});

function rollOnTable(table: RandomTableType): { choice: RandomChoiceItemThresholdType | undefined, selectedIndex: number, totalWeight: number, valueType: RandomValueType } {

  console.log('random-tables.vue rollOnTable() table: ', table);
  let totalWeight = 0;
  const choices = [...table.values].map((choice : RandomChoiceItemType) : RandomChoiceItemThresholdType => {
    const weight = choice?.weight || 1;
    totalWeight += weight;
    return { ...choice, threshold: totalWeight };
  });
  const selectedIndex = getRandomIntInclusive(1, totalWeight);
  let choice;
  let lastThreshold = 0;
  for (let i = 0; i < choices.length; i++) {
    if (lastThreshold < selectedIndex && selectedIndex <= choices[i].threshold) {
      choice = choices[i];
      break;
    }
  }
  console.log('random-tables.vue rollOnTable() selected choice: ', choice);
  return {choice, selectedIndex, totalWeight, valueType : table['value-type']};
}

function clickedToRoll(evt: Event) {
  if (data.value?.length && evt.target?.id) {
    const table = data.value.find((tbl:any) => tbl?.meta?.body?.id === evt.target?.id);
    if (table) {
      const { choice, selectedIndex, totalWeight, valueType } = rollOnTable(table);
      resultsLog.value.push({ timestamp: Date.now(), choice, selectedIndex, totalWeight, valueType });
      console.log('random-tables.vue clickedToRoll() resultsLog: ', resultsLog);
    }
  }
}

</script>

<template>
  <h1>Random Tables</h1>
  <ul class="tables-nav smol-flexbox-grid">
    <li v-if="! data">No random tables to list</li>
    <li v-for="table of data">
      <div v-if="table?.meta?.body">
        <div>
          <p>{{ table.meta.body.title }}</p>
          <button @click="clickedToRoll" :id="table.meta.body.id">Pick One</button>
        </div>
      </div>
    </li>
  </ul>
  <hr>
  <div>
    <h2>Results</h2>
    <RandomResultLog :log="resultsLog" />
  </div>
</template>

<style scoped>

ul.tables-nav {
  list-style-type: none;
  --min: 10ch;
  --gap: 1rem;

  display: flex;
  flex-wrap: wrap;
  gap: var(--gap);

}

ul.tables-nav > li {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
  height: 5rem;
  flex: 1 1 var(--min);
}


</style>