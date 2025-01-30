<script setup lang="ts">

const route = useRoute()

const {data} = await useAsyncData(route.path, async () => {
      console.log('[...slug].vue searching for route.path: ', route.path);
      let data = await queryCollection('content').path(route.path).first();
      if (!data) {
        // Look up first content in directory, because there's no index.md.
        const pathExpression = [route.path, (route.path.endsWith('/') ? '' : '/'), '%'].join('');
        data = await queryCollection('content')
            .where('path', 'LIKE', pathExpression)
            .first()
        ;
      }
      console.log('[...slug].vue data.body.toc: ', data.body.toc);
      return data;
    }
);

const tocExpanded=ref(false);

onMounted(() => {
  if (route.hash) {
    const hashElement = document.querySelector(route.hash);
    if (hashElement) {
      hashElement.scrollIntoView({behavior: 'smooth'});
    }
  }
  console.log('[...slug].vue tocExpanded: ', tocExpanded);
});

useServerSeoMeta({
  title: data?.value?.title,
  description: data?.value?.description
});

function toggleToc() {
  tocExpanded.value = !tocExpanded.value;
}

</script>

<template>
  <InfoPage
      :page_title="data?.title || ''"
      max-width-rems="90"
      use-inner-inset
      sidepanel-overlay
      :sidepanelExpanded="tocExpanded"
      sidepanelWidthRems="50"
  >
    <ContentRenderer v-if="data" :value="data"/>
    <div v-else>Page not found</div>
    <template v-slot:sidepanel>
      <TableOfContents v-if="data?.body?.toc?.length > 1 || route.path !== '/tatterpedia'" :toc="data?.body?.toc" :isExpanded="tocExpanded" @toggle-toc="toggleToc"/>
    </template>
  </InfoPage>
</template>

<style scoped>


</style>