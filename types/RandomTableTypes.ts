import {z} from "zod";

export const randomChoiceItemSchema =
    z.object({
        'id': z.string(),
        'name': z.string(),
        'value': z.string().optional(),
        'weight': z.number().int().positive().optional()
    });


export const randomTableSchema = z.object({
    'id': z.string(),
    'title': z.string(),
    'value-type': z.enum(['color', 'string', 'url']),
    'values': z.array(randomChoiceItemSchema)
});

export type RandomTableType = z.infer<typeof randomTableSchema>;
export type RandomChoiceItemType = z.infer<typeof randomChoiceItemSchema>;
export type RandomChoiceItemThresholdType = RandomChoiceItemType & { threshold: number };



export interface ResultsLine {
    timestamp: number,
    choice: RandomChoiceItemThresholdType | undefined,
    selectedIndex: number,
}