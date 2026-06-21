<script setup lang="ts">

defineProps<{
  imageUrl: string,
  alt?: string,
  caption?: string,
}>();

</script>

<template>
  <div class="character-image-container">
    <ProseImg
        :src="imageUrl"
        :alt="alt"
        :caption="caption"
        size="medium"
    />
  </div>
</template>

<style scoped>
div.character-image-container :deep(img) {
  padding: 0.5rem;
}
</style>