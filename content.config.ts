import {defineContentConfig, defineCollection} from '@nuxt/content'
import {z} from "zod";

export default defineContentConfig({
    collections: {
        content: defineCollection({
            type: 'page',
            source: '**/*.md',
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