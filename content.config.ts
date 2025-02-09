import {defineContentConfig, defineCollection} from '@nuxt/content'
import {z} from "zod";
import { randomTableSchema } from './types/RandomTableTypes';

export default defineContentConfig({
    collections: {
        content: defineCollection({
            type: 'page',
            source: '*.md',
            schema: z.object({
                'extra-nav-links': z.object({
                    'pre': z.array(
                        z.object({
                            text: z.string(),
                            'handler-tag': z.enum(['pick-random']),
                        })
                    ).optional()
                })
            })
        }),
        tatterpedia: defineCollection({
            type: 'page',
            source: 'tatterpedia/**/*.md',
            schema: z.object({
                'extra-nav-links': z.object({
                    'pre': z.array(
                        z.object({
                            text: z.string(),
                            'handler-tag': z.enum(['pick-random']),
                        })
                    ).optional()
                })
            })
        }),
        rulesAndSystems: defineCollection({
            type: 'page',
            source: 'rules-and-systems/**/*.md',
            schema: z.object({
                'extra-nav-links': z.object({
                    'pre': z.array(
                        z.object({
                            text: z.string(),
                            'handler-tag': z.enum(['pick-random']),
                        })
                    ).optional()
                })
            })
        }),
        randomTables: defineCollection({
            type: 'data',
            source: 'random-tables/**/*.json',
            schema: randomTableSchema
        })
    }
})