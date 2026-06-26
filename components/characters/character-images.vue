<script setup lang="ts">

import { type ImageData } from "~/types/character/CharacterTypes";

const props = defineProps<{
  images: ImageData[]
}>();

const imageIndex = ref(0);

function incrementImage(incVal: number) {
  let newIndex = imageIndex.value + incVal;
  if (newIndex >= props.images.length) {
    newIndex = 0;
  } else if (newIndex < 0) {
    newIndex = props.images.length - 1;
  }
  imageIndex.value = newIndex;
}

function handleClick(e: PointerEvent) {
  const target = e.target as HTMLElement;
  const targetRect = target.getBoundingClientRect();
  if (e.offsetX < targetRect.width / 2) {
    incrementImage(-1);
  } else {
    incrementImage(+1);
  }
}
</script>

<template>
  <div v-if="images.length" class="character-images-container">
    <ProseImg
        v-for="(imageData, index) of images"
        :src="imageData.uri"
        :caption="`${(imageData.caption ?? '')}${images.length > 1 ? ' ' + (index+1).toString() + '/' + images.length.toString() : ''}`"
        size="medium"
        :key="index"
        :data-image-index="index"
        :class="{ shown: imageIndex === index }"
        @click="handleClick"
    />
  </div>
</template>

<style scoped>

div.character-images-container :deep(img) {
  padding: 0.5rem;
}
div.character-images-container :deep(div.figure-container) {
  display: none;
}
div.character-images-container :deep(div.figure-container.shown) {
  display: flex;
}
</style>