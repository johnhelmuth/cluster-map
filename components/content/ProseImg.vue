<!--
   ProseImg replacement that acts as a figure, optionally with a caption

   Supports left, center, right alignment.
   left and right alignments causes the text to wrap around the image.

   Supports size of image as 'x-small', 'small', 'medium' or 'large'
     'size' sets the width of the image as follows
         'x-small': 20cqw
         'small': 40cqw
         'medium': 60cqw
         'large': 90cqw

   Markdown:
   ```markdown

     ![Alt text here](/path/to/image.jpg){ size="large" caption="Caption text here" align="right" }

   ```

-->

<script setup lang="ts">
// Most of this script code copied from Nuxt Content mdc ProseImg component at
// https://github.com/nuxt-modules/mdc/blob/main/src/runtime/components/prose/ProseImg.vue

import {withTrailingSlash, withLeadingSlash, joinURL} from 'ufo'
import {useRuntimeConfig, computed} from '#imports'

export type alignType = 'center' | 'left' | 'right';
export type sizeType = 'x-small' | 'small' | 'medium' | 'large';

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
  },
  size: {
    type: [String, null]
  }
})

function isValidAlign(value: any): value is alignType {
  return value && ['left', 'center', 'right'].includes(value);
}
function isValidSize(value: any): value is sizeType {
  return value && ['x-small', 'small', 'medium', 'large'].includes(value);
}

const refinedSrc = computed(() => {
  if (props.src?.startsWith('/') && !props.src.startsWith('//')) {
    const _base = withLeadingSlash(withTrailingSlash(useRuntimeConfig().app.baseURL))
    if (_base !== '/' && !props.src.startsWith(_base)) {
      return joinURL(_base, props.src)
    }
  }
  return props.src
});

const refinedAlign = computed((): alignType => {
  if (isValidAlign(props.align)) {
    return props.align;
  }
  return 'center';
});

// Always use a caption if specified.
const captionValue = computed(() => {
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

const refinedSize = computed((): sizeType => {
  if (props.size && isValidSize(props.size)) {
    return props.size;
  }
  return 'medium';
})

function containerClasses(
    align: alignType,
    size: sizeType,
    caption: string
) {
  return {
    [size]: true,
    captioned: caption,
    left: (align == 'left'),
    right: (align == 'right'),
    center: (align == 'center')
  };
}

</script>

<template>
  <div class="figure-container"
      :class="containerClasses(refinedAlign, refinedSize, captionValue)"
  >
    <figure>
      <img
          :src="refinedSrc"
          :alt="altValue"
          :width="props.width"
          :height="props.height"
      />
      <figcaption v-if="captionValue">{{ captionValue }}</figcaption>
    </figure>
  </div>
</template>

<style scoped>

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
  margin: 1rem;
}

div.figure-container figure img {
  width: 75cqw; /* Default to center */
  height: auto;
  border: 1px solid var(--color-border);
}

div.figure-container.left figure img, div.figure-container.right figure img {
  width: 40cqw; /* Smaller for floating images, left or right. */
}
/* Except when the size is explicitly called for */
div.figure-container.x-small figure img {
  width: 20cqw
}
div.figure-container.small figure img {
  width: 40cqw
}
div.figure-container.medium figure img {
  width: 60cqw
}
div.figure-container.large figure img {
  width: 90cqw
}

@media (max-width: 700px) {
  div.figure-container figure img, div.figure-container.left figure img, div.figure-container.right figure img
    div.figure-container.x-small figure img, div.figure-container.small figure img, div.figure-container.medium figure img, div.figure-container.large figure img
  {
    width: 90cqw; /* Too small to float text next to it, make them all the same. */
  }
  div.figure-container.left, div.figure-container.right {
    float: revert;
  }
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