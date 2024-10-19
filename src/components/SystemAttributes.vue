<script setup lang="ts">

import type SystemAttributesInterface from "@/models/SystemModel";
import { attributesFormatted, formatAttribute } from '@/data/attributes-meta';

defineProps< {
  attributes: SystemAttributesInterface
}>();

const displayStyles = [ 'short', 'long', 'detailed'];
let currentDisplayStyle = 0; // short

function toggleAttributesSize(e) {
  const infoBlock = e.currentTarget.parentElement;
  if (infoBlock) {
    infoBlock.classList.remove(displayStyles[currentDisplayStyle]);
    if (currentDisplayStyle < 2) {
      currentDisplayStyle++;
    } else {
      currentDisplayStyle = 0;
    }
    infoBlock.classList.add(displayStyles[currentDisplayStyle]);
  }
}
</script>

<template>
  <div class="system-attributes-container short">
    <div @click="toggleAttributesSize" class="system-attributes short">
      {{ attributesFormatted(attributes, "short")}}
    </div>
    <div @click="toggleAttributesSize" class="system-attributes long">
      {{ attributesFormatted(attributes, "long")}}
    </div>
    <div @click="toggleAttributesSize" class="system-attributes detailed">
      <ul>
        <li v-for="( attribute, attr_name) in attributes" :key="attr_name">
          {{ formatAttribute(attr_name, attribute, "detailed")}}
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>

.system-attributes-container.short .system-attributes.short {
  display: block;
}
.system-attributes-container.short .system-attributes.long, .system-attributes-container.short .system-attributes.detailed {
  display: none;
}

.system-attributes-container.long .system-attributes.long {
  display: block;
}
.system-attributes-container.long .system-attributes.short, .system-attributes-container.long .system-attributes.detailed  {
  display: none;
}

.system-attributes-container.detailed .system-attributes.detailed {
  display: block;
}
.system-attributes-container.detailed .system-attributes.short, .system-attributes-container.detailed .system-attributes.long  {
  display: none;
}

.system-attributes.detailed ul {
  list-style: none;
  padding-left: .5rem;
}

</style>
