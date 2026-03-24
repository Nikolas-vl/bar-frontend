import { z } from 'zod';

const optionalNumber = (min = 0) =>
  z.preprocess(val => {
    if (val === '' || val == null) return undefined;
    const num = Number(val);
    return isNaN(num) ? undefined : num;
  }, z.number().min(min).optional());

export const dishSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  price: z.coerce.number().min(0.01, 'Price must be at least 0.01'),
  imageUrl: z.preprocess(val => (val === '' ? undefined : val), z.string().url('Must be a valid URL').optional()),
  calories: optionalNumber(0),
  protein: optionalNumber(0),
  fat: optionalNumber(0),
  carbs: optionalNumber(0),
  category: z.enum(['BREAKFAST', 'LUNCH']),
  isAvailable: z.boolean(),
});

export type DishFormInput = z.input<typeof dishSchema>;
export type DishFormOutput = z.output<typeof dishSchema>;
