<script setup lang="ts">

const route = useRoute();

const {data} = await useAsyncData(`randomTable/${route.params.tableName}`, async () => {
      const tableName = route.params.tableName[0];
      console.log('/random-tables/[...tableName].vue searching for tableName: ', tableName);
      let data = await queryCollection('randomTables')
          .where('slug', '=', tableName)
          .first();
      console.log('/random-tables/[...tableName].vue data: ', data);
      return data;
    }
);

onMounted(() => {
  console.log('/random-tables/[...tableName].vue mounted.');
});

</script>

<template>
  <div class="random-table">
    <div class="header-cell">ID</div>
    <div class="header-cell">Name</div>
    <div class="header-cell">Weight</div>
    <div class="header-cell">Threshold</div>
    <template v-if="data?.values" v-for="row of data?.values">
      <div class="row-cell row-id">{{row.id}}</div>
      <div class="row-cell row-name">{{row.name}}</div>
      <div class="row-cell row-weight">{{ row?.weight || 1 }}</div>
      <div class="row-cell row-threshold"></div>
    </template>
  </div>
</template>

<style scoped>

.random-table {
  width: calc(100% - 1rem);
  display: grid;
  grid-template-columns: 5rem 10rem 1fr 1fr;
}


</style>