import { z } from 'zod';

export const editUserSchema = z.object({
  name: z.string().optional(),
  phone: z.string().optional(),
  password: z.string().min(6, 'Min 6 characters').optional().or(z.literal('')),
  role: z.enum(['USER', 'ADMIN']),
});

export type EditUserFormInput = z.input<typeof editUserSchema>;
export type EditUserFormOutput = z.output<typeof editUserSchema>;
