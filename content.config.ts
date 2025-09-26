import {type ResolvedCollectionSource, defineContentConfig, defineCollection} from '@nuxt/content'
import {z} from "zod";
import { convertJsonSchemaToZod } from 'zod-from-json-schema';
import characterSchema from './data/schemas/characters/character.schema.json';

const zodCharacterSchema = convertJsonSchemaToZod(characterSchema);
const contentSource = {
  include: '**/*',
  exclude: ['characters/**/*.json', '**/*.png', '**/*.svg', '**/*.jpg', '**/*.jpeg', 'LICENSE', '.git', '**/.DS_Store', '**/.idea'],
} as ResolvedCollectionSource;

const characterSource = {
  include: 'characters/**/*.json',
} as ResolvedCollectionSource;

if (process.env.CONTENT_LOCAL_PATH) {
  contentSource.cwd = process.env.CONTENT_LOCAL_PATH;
  characterSource.cwd = process.env.CONTENT_LOCAL_PATH;
} else {
  contentSource.repository = process.env.GH_URL || 'https://github.com/johnhelmuth/in-dire-straits-content/tree/main';
  contentSource.authToken = process.env.GH_TOKEN;
  characterSource.repository = process.env.GH_URL || 'https://github.com/johnhelmuth/in-dire-straits-content/tree/feature/fate-character-sheets-as-content';
  characterSource.authToken = process.env.GH_TOKEN;
}

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: 'page',
      source: contentSource,
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
      })
    }),
    characters: defineCollection({
      type: 'data',
      source: characterSource,
      schema: zodCharacterSchema
    })
  }
})
