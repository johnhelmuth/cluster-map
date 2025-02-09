<script setup lang="ts">

const route = useRoute()

const {data} = await useAsyncData(route.path, async () => {
      console.log('/random-tables/[...slug].vue searching for route.path: ', route.path);
      let data = await queryCollection('randomTables').path(route.path).first();
      console.log('/random-tables/[...slug].vue data: ', data);
      return data;
    }
);

onMounted(() => {
  console.log('/random-tables/[...slug].vue mounted.');
});

</script>

<template>
  <pre>
    {{ data }}
  </pre>
</template>

<style scoped>


</style>