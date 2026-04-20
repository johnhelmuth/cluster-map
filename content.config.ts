import {type ResolvedCollectionSource, defineContentConfig, defineCollection} from '@nuxt/content'
import {z} from "zod";

let sourceConnection = {} as Partial<Pick<ResolvedCollectionSource, "cwd" | "repository">>;
if (process.env.CONTENT_LOCAL_PATH) {
  sourceConnection.cwd = process.env.CONTENT_LOCAL_PATH;
} else {
  sourceConnection.repository = {
    url: process.env.GH_URL || 'https://github.com/johnhelmuth/in-dire-straits-content/tree/main',
    auth: {
      token: process.env.GH_TOKEN
    }
  };
}
const exclude = [
  '**/*.png',
  '**/*.svg',
  '**/*.jpg',
  '**/*.jpeg',
  'LICENSE',
  '.git',
  '**/.DS_Store',
  '**/.idea'];

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: 'page',
      source: {
        include: '**/*',
        exclude: [
          'campaigns/**/*',
          'news/**/*',
          ...exclude
        ],
        ...sourceConnection
      },
      schema: z.object({
        'extra-nav-links': z.object({
          'pre': z.array(
            z.object({
              text: z.string(),
              'handler-tag': z.enum(['pick-random']),
            })
          )
        }),
        'in_game_start': z.string(),
        'in_game_end': z.string(),
        'publish_date': z.string(),
      })
    }),
    campaigns: defineCollection({
      type: 'page',
      source: {
        include: 'campaigns/**/*',
        exclude,
        ...sourceConnection
      },
      schema: z.object({
        'in_game_start': z.string(),
        'in_game_end': z.string(),
        'publish_date': z.string(),
      })
    }),
    news: defineCollection({
      type: 'page',
      source: {
        include: 'news/**/*',
        exclude,
        ...sourceConnection
      },
      schema: z.object({
        'publish_date': z.string(),
      })
    })

  }
})
