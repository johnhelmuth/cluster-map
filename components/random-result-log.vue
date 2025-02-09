<script setup lang="ts">

import type {ResultsLine} from '@/types/RandomTableTypes'

const props = defineProps<{
  log: Array<ResultsLine>
}>();

function timeFormatted(timestamp: number): string {
  const timeF = new Date(timestamp);
  console.log('timeFormatted() timeF', timeF);
  return timeF.toLocaleTimeString();
}

function longTime(timestamp: number) : string {
  const timeF = new Date(timestamp);
  console.log('longTime() timeF', timeF);
  return timeF.toLocaleString();

}

const debug = computed(() => {
  console.log('debug computed(). props.log: ', props.log);
});

onMounted(() => {
  console.log('RandomResultLog mounted.');
})

</script>

<template>
  <div class="results-table">
    <div class="header-cell header-time">Timestamp</div>
    <div class="header-cell header-roll">Roll</div>
    <div class="header-cell header-name">Name</div>
    <template v-for="line of log">
      <div class="line-cell line-time" :title="longTime(line.timestamp)">{{ timeFormatted(line.timestamp) }}</div>
      <div class="line-cell line-roll">{{ line?.selectedIndex }} / {{ line?.totalWeight }}</div>
      <div class="line-cell line-name line-string" v-if="line?.valueType === 'string'">{{ line?.choice?.name }} {{ line?.choice?.value }}</div>
      <div class="line-cell line-name line-color" v-if="line?.valueType === 'color'">
        <div class="color-name" :style="{ '--swatch-color': line?.choice?.value }" >{{ line?.choice?.name }}</div>
      </div>
      <div class="line-cell line-name line-url" v-if="line?.valueType === 'url'"><a :href="line?.choice?.value">{{ line?.choice?.name }}</a></div>
    </template>
  </div>
</template>

<style scoped>

.results-table {
  width: calc(100% - 1rem);
  display: grid;
  grid-template-columns: 10rem 5rem 1fr;
}

.results-table > * {
  padding: 0.25rem;
}
.header-cell {
  font-weight: bold;
  text-align: left;
}
.header-cell.header-time, .header-cell.header-roll {
  text-align: center;
}

.line-cell {
  text-align: left;
}

.line-cell.line-time,
.line-cell.line-roll {
  text-align: center;
}

.line-cell.line-color {
  text-align: center;
  display: flex;
  flex-direction: row;
  justify-content: left;
}
.line-cell.line-color .color-name {
  --swatch-color: white;
  --color-invert-offset: 0.6;
  padding: 0.5rem 1rem;
  width: 10rem;
  font-weight: bold;
  background-color: var(--swatch-color);
  color: color(from var(--swatch-color) srgb calc((r - var(--color-invert-offset)) * -1000) calc((g - var(--color-invert-offset)) * -1000) calc((b - var(--color-invert-offset)) * -1000));
}


</style>