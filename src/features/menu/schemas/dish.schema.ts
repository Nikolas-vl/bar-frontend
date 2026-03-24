import { z } from 'zod';
import type { DishQuery } from '@/shared/types';

export const dishQuerySchema = z.object({
  search: z.string().optional(),
  category: z.enum(['BREAKFAST', 'LUNCH']).optional(),
  minPrice: z.number().positive().optional(),
  maxPrice: z.number().positive().optional(),
  minCalories: z.number().int().positive().optional(),
  maxCalories: z.number().int().positive().optional(),
  isAvailable: z.boolean().optional(),
  sortBy: z.enum(['name', 'price', 'calories', 'protein', 'fat', 'carbs']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
}) satisfies z.ZodType<DishQuery>;

export type DishQuerySchema = z.infer<typeof dishQuerySchema>;
export type { DishQuery };
