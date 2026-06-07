<script setup lang="ts">

const route = useRoute()

const {data} = await useAsyncData(`campaigns-session-${route.path}`, async () => {
      let data = await queryCollection('campaigns').path(route.path).first();
      if (!data) {
        // Look up first content in directory, because there's no index.md.
        const pathExpression = [route.path, (route.path.endsWith('/') ? '' : '/'), '%'].join('');
        data = await queryCollection('campaigns')
            .where('path', 'LIKE', pathExpression)
            .first()
        ;
      }
      return data;
    }
);

onMounted(() => {
  if (route.hash) {
    const hashElement = document.querySelector(route.hash);
    if (hashElement) {
      hashElement.scrollIntoView({behavior: 'smooth'});
    }
  }
});

if (import.meta.server) {
  useSeoMeta({
    title: data?.value?.title,
    description: data?.value?.description
  });
}

</script>

<template>
  <InfoPage
      :page_title="data?.title || ''"
  >
    <TableOfContents
        v-if="(data?.body?.toc?.links?.length || 0) > 0 && route.path !== '/tatterpedia'"
        :toc="data?.body?.toc"
    />
    <ContentRenderer v-if="data" :value="data"/>
    <div class="not-found" v-else>
      <h1>Page not found</h1>
      <p>Go to <NuxtLink :to="{ path: '/campaigns' }">Campaigns home</NuxtLink></p>
    </div>
  </InfoPage>
</template>

<style scoped>

div.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

</style>