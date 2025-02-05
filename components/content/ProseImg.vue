<!--
   ProseImg replacement that acts as a figure, optionally with a caption

   Also supports left, center, right alignment.
   left and right alignments causes the text to wrap around the image.

   Markdown:
   ```markdown

     ![Alt text here](/path/to/image.jpg){ width="200" height="100" caption="Caption text here" align="right" }

   ```

-->

<script setup lang="ts">
// Most of this script code copied from Nuxt Content mdc ProseImg component at
// https://github.com/nuxt-modules/mdc/blob/main/src/runtime/components/prose/ProseImg.vue

import {withTrailingSlash, withLeadingSlash, joinURL} from 'ufo'
import {useRuntimeConfig, computed} from '#imports'

const props = defineProps({
  src: {
    type: String,
    default: ''
  },
  thumbnail: {
    type: String,
    default: '',
  },
  alt: {
    type: String,
    default: ''
  },
  width: {
    type: [String, Number],
    default: undefined
  },
  height: {
    type: [String, Number],
    default: undefined
  },
  caption: {
    type: String,
    default: '',
  },
  align: {
    type: String,
    default: 'center'
  }
})

const refinedSrc = computed(() => {
  if (props.src?.startsWith('/') && !props.src.startsWith('//')) {
    const _base = withLeadingSlash(withTrailingSlash(useRuntimeConfig().app.baseURL))
    if (_base !== '/' && !props.src.startsWith(_base)) {
      return joinURL(_base, props.src)
    }
  }
  return props.src
});

const refinedAlign = computed(() => {
  if (['left','center','right'].includes(props.align)) {
    return props.align;
  }
  return 'center';
});

// Always use a caption if specified.
const captianValue = computed(() => {
  if (props.caption && props.caption.length > 0) {
    return props.caption;
  }
  return '';
});

// If there's a caption and an alt, and they are they same, don't use the alt value.
// (Don't spam screen reader users with duplicate content.)
const altValue = computed(() => {
  if (props.alt) {
    if (props.caption && props.caption !== props.alt) {
      return props.alt;
    }
  }
  return '';
});

</script>

<template>
  <div :class="{ 'figure-container': true, captioned: captianValue, left: (refinedAlign=='left'), right: (refinedAlign=='right'), center: (refinedAlign=='center') }">
    <figure>
      <img
          :src="refinedSrc"
          :alt="altValue"
          :width="props.width"
          :height="props.height"
      />
      <figcaption v-if="captianValue">{{ captianValue }}</figcaption>
    </figure>
  </div>
</template>

<style scoped>

div.figure-container {
  width: v-bind('width');
  max-width: v-bind('width');
}

div.figure-container.left {
  float: left;
}

div.figure-container.center {
  display: flex;
  justify-content: center;
}

div.figure-container.right {
  float: right;
}

div.figure-container figure {
  width: v-bind('width');
  max-width: v-bind('width');
  margin: 1rem;
}

/* Trick the web page to get the caption to wrap to the width of the image by
   setting them up as a table and its caption.
 */
div.figure-container.captioned figure {
  display: table;
}

.figure-container.captioned figure figcaption {
  display: table-caption;
  caption-side: bottom;
  text-align: center;
  font-size: 60%;
  font-style: italic;
}

</style>