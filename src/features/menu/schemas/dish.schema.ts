import { z } from 'zod';

export const dishQuerySchema = z.object({
  search: z.string().optional(),
  category: z.enum(['BREAKFAST', 'LUNCH']).optional(),
  minPrice: z.number().positive().optional(),
  maxPrice: z.number().positive().optional(),
  isAvailable: z.boolean().optional(),
  sortBy: z.enum(['name', 'price', 'calories']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export type DishQuerySchema = z.infer<typeof dishQuerySchema>;
