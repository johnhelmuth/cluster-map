import {defineContentConfig, defineCollection, type ResolvedCollectionSource} from '@nuxt/content'
import {z} from "zod";

const source = {
  include: '**/*',
  exclude: ['**/*.png', '**/*.svg', '**/*.jpg', 'LICENSE'],
} as ResolvedCollectionSource;

if (process.env.CONTENT_LOCAL_PATH) {
  source.cwd = process.env.CONTENT_LOCAL_PATH;
} else {
  source.repository = process.env.GH_URL || 'https://github.com/johnhelmuth/in-dire-straits-content/tree/main';
  source.authToken = process.env.GH_TOKEN;
}

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: 'page',
      source,
      schema: z.object({
        'extra-nav-links': z.object({
          'pre': z.array(
            z.object({
              text: z.string(),
              'handler-tag': z.enum(['pick-random']),
            })
          )
        })
      })
    })
  }
})
