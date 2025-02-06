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
      return data;
    }
);

const tocExpanded=ref(false);

const extraNavLinks = computed(() => {
  return data?.value?.['extra-nav-links'];
});

onMounted(() => {
  if (route.hash) {
    const hashElement = document.querySelector(route.hash);
    if (hashElement) {
      hashElement.scrollIntoView({behavior: 'smooth'});
    }
  }
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
      use-inner-inset
  >
    <TableOfContents
        v-if="(data?.body?.toc?.links?.length || 0) > 0 && route.path !== '/tatterpedia'"
        :toc="data?.body?.toc"
        :extraNavLinks="extraNavLinks"
        :isExpanded="tocExpanded"
        @toggle-toc="toggleToc"
    />
    <ContentRenderer v-if="data" :value="data"/>
    <div v-else>Page not found</div>
  </InfoPage>
</template>

<style scoped>


</style>