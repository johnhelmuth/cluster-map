<script setup lang="ts">

import type { SystemAttributesInterface } from "@/types/SystemTypes";
import { attributesFormatted, formatAttribute } from '@/data/attributes-meta';
import type {attributeFormatType} from "@/types/BasicTypes";

defineProps< {
  attributes?: SystemAttributesInterface,
  attributesFormat: attributeFormatType,
}>();

</script>

<template>
  <div class="system-attributes-container" :class="attributesFormat">
    <div class="system-attributes short">
      {{ attributesFormatted(attributes, "short")}}
    </div>
    <div class="system-attributes long">
      {{ attributesFormatted(attributes, "long")}}
    </div>
    <div class="system-attributes detailed">
      <ul>
        <li v-for="( attribute, attr_name) in attributes || []" :key="attr_name">
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
