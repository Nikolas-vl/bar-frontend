import { z } from 'zod';

export const ingredientSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  price: z.coerce.number().min(0, 'Price must be 0 or above'),
});

export type IngredientFormInput = z.input<typeof ingredientSchema>;
export type IngredientFormOutput = z.output<typeof ingredientSchema>;
