<script setup lang="ts">

import {withTrailingSlash, withLeadingSlash, joinURL} from 'ufo'
import {useRuntimeConfig, computed} from '#imports'

export type alignType = 'center' | 'left' | 'right';
export type verticalPositionType = 'before' | 'after';
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
  verticalPosition: {
    type: String,
    default: 'before'
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
function isValidVerticalPosition(value: any): value is verticalPositionType {
  return value && ['before', 'after'].includes(value);
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

const refinedVerticalPosition = computed((): verticalPositionType => {
  if (isValidVerticalPosition(props.verticalPosition)) {
    return props.verticalPosition;
  }
  return 'before';
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
    verticalPosition: verticalPositionType,
    caption: string
) {
  return {
    [size]: true,
    captioned: caption,
    left: (align == 'left'),
    right: (align == 'right'),
    center: (align == 'center'),
    before: (verticalPosition === 'before'),
    after: (verticalPosition === 'after'),
  };
}

</script>

<template>
  <div class="paragraph-with-image"
       :class="containerClasses(refinedAlign, refinedSize, refinedVerticalPosition, captionValue)"
  >
    <div class="figure-container">
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
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>

div.paragraph-with-image {
  display: grid;
  /* By default, stack vertically into 2 rows, one for image, one for paragraph(s) text. */
  grid-template-columns: 1fr;
  grid-template-rows: min-content min-content;
  grid-template-areas: "image"
                       "content";
  align-items: center;
  justify-content: space-around;
}

div.paragraph-with-image.left {
  /* Everything in 1 row with max height = to the larger of the two divs,
   * image on the left.
   */
  grid-template-columns: min-content 1fr;
  grid-template-rows: auto;
  grid-template-areas: "image content";
}

div.paragraph-with-image.right {
  /* Everything in 1 row with max height = to the larger of the two divs,
   * image on the right.
   */
  grid-template-columns: 1fr min-content;
  grid-template-rows: auto;
  grid-template-areas: "content image";
}
div.paragraph-with-image.after {
  /* By default, stack vertically into 2 rows, first for paragraph(s) text, second for image. */
  grid-template-columns: 1fr;
  grid-template-rows: min-content min-content;
  grid-template-areas: "content"
                       "image";
  align-items: center;
  justify-content: space-around;
}
div.content {
  grid-area: content;
}

div.figure-container {
  grid-area: image;
}
div.paragraph-with-image.center div.figure-container {
  margin-left: auto;
  margin-right: auto;
}

div.figure-container figure {
  margin: 1rem;
}

div.figure-container figure img {
  width: 75cqw; /* Default to center */
  height: auto;
  border: 1px solid var(--color-border);
}

div.paragraph-with-image.left div.figure-container figure img, div.paragraph-with-image.right div.figure-container figure img {
  width: 40cqw; /* Smaller for floating images, left or right. */
}
/* Except when the size is explicitly called for */
div.paragraph-with-image.x-small div.figure-container figure img {
  width: 20cqw
}
div.paragraph-with-image.small div.figure-container figure img {
  width: 40cqw
}
div.paragraph-with-image.medium div.figure-container figure img {
  width: 60cqw
}
div.paragraph-with-image.large div.figure-container figure img {
  width: 90cqw
}

@media (max-width: 700px) {
  div.paragraph-with-image.left, div.paragraph-with-image.right {
    grid-template-columns: 1fr;
    grid-template-rows: min-content min-content;
    grid-template-areas: "image"
                       "content";
  }
  div.paragraph-with-image.right {
    grid-template-areas: "content"
                       "image";
    align-items: center;
    justify-content: space-around;
  }
  div.paragraph-with-image.left div.figure-container figure img, div.figure-container figure img,
  div.paragraph-with-image.right div.figure-container figure img,
  div.paragraph-with-image.x-small div.figure-container figure img,
  div.paragraph-with-image.small div.figure-container figure img,
  div.paragraph-with-image.medium div.figure-container figure img,
  div.paragraph-with-image.large div.figure-container figure img
  {
    width: 90cqw; /* Too small to float text next to it, make them all the same. */
  }
}

/* Trick the web page to get the caption to wrap to the width of the image by
   setting them up as a table and its caption.
 */
div.paragraph-with-image.captioned div.figure-container figure {
  display: table;
}

div.paragraph-with-image.captioned .figure-container figure figcaption {
  display: table-caption;
  caption-side: bottom;
  text-align: center;
  font-size: 60%;
  font-style: italic;
}
</style>