import {z} from 'zod';

export type PointType = {
  x: number;
  y: number;
  z?: number;
};

export const PointZSchema = z.object({
  x: z.number(),
  y: z.number(),
  z: z.string().optional()
});

export function isPointType(data: any): data is PointType {
  return PointZSchema.safeParse(data).success;
}