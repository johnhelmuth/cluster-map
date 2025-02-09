import {z} from "zod";

export const randomChoiceItemSchema =
    z.object({
        'id': z.string(),
        'name': z.string(),
        'value': z.string().optional(),
        'weight': z.number().int().positive().optional()
    });

export const randomTableSchema = z.object({
    'slug': z.string(),
    'title': z.string(),
    'value-type': z.enum(['color', 'string', 'url']),
    'values': z.array(randomChoiceItemSchema),
    'meta': z.object({
        'body': z.object({}),
        'path': z.string(),
    })
});

export type RandomTableType = z.infer<typeof randomTableSchema>;
export type RandomChoiceItemType = z.infer<typeof randomChoiceItemSchema>;
export type RandomChoiceItemThresholdType = RandomChoiceItemType & { threshold: number };


export type RandomValueType = 'color' | 'string' | 'url';

export interface ResultsLine {
    timestamp: number,
    choice: RandomChoiceItemThresholdType | undefined,
    selectedIndex: number,
    totalWeight: number,
    valueType: RandomValueType
}