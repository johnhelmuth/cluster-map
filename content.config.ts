import {type ResolvedCollectionSource, defineContentConfig, defineCollection} from '@nuxt/content'
import { z } from 'zod';
import { convertJsonSchemaToZod } from 'zod-from-json-schema';
import characterSchema from '/Users/johnhelmuth/src/cluster-map/data/schemas/characters/character.schema.json';
// @ts-ignore zod's type export are jacked up?
import type {JSONSchema} from "zod/v4";

const zodCharacterSchema = convertJsonSchemaToZod(characterSchema as JSONSchema);
console.log('characterSchema', characterSchema);
// console.log('zodCharacterSchema.def.shape.refresh', zodCharacterSchema.def.shape.refresh);
let sourceConnection = {} as Partial<Pick<ResolvedCollectionSource, "cwd" | "repository">>;
if (process.env.CONTENT_LOCAL_PATH) {
  sourceConnection.cwd = process.env.CONTENT_LOCAL_PATH;
} else {
  sourceConnection.repository = {
    url: process.env.GH_URL || 'https://github.com/johnhelmuth/in-dire-straits-content',
    branch: process.env.GH_BRANCH || 'main',
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
    }),
    characters: defineCollection({
      type: 'data',
      source: {
        include: 'characters/**/*.json',
        exclude,
        cwd: 'data'
      },
      schema: characterSchema
    })

  }
})
