<script setup lang="ts">

const route = useRoute()

const {data} = await useAsyncData(route.path, async () => {
  const data = await queryCollectionNavigation('campaigns', ['id', 'title', 'description', 'path'])
      .where('path', 'LIKE', `/campaigns/%/%`)
      .order('in_game_start', 'ASC')
  ;
  if (data && data.length > 0 && typeof data[0] !== 'undefined') {
    const { title, description, children: campaigns } = data[0];
    return {title, description, campaigns};
  }
});
</script>

<template>
  <InfoPage :page_title="data?.title || 'Campaigns'">
    <p v-if="data?.description">{{ data.description }}</p>
    <ul v-if="data?.campaigns" class="campaign-list">
      <li v-for="(campaign, index) in data.campaigns" :key="index">
        <NuxtLink :to="campaign.path">{{ campaign.title }}</NuxtLink><span v-if="campaign.description"> - {{ campaign.description }}</span>
      </li>
    </ul>
  </InfoPage>
</template>

<style scoped>

</style>