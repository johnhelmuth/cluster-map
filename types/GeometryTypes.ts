import {z} from 'zod';

export const PointZSchema = z.object({
  x: z.number(),
  y: z.number(),
  z: z.number().optional()
});

export type PointType = z.infer<typeof PointZSchema>;

export function isPointType(data: any): data is PointType {
  return PointZSchema.safeParse(data).success;
}