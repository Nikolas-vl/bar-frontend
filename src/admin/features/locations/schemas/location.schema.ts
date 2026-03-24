import { z } from 'zod';

export const locationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  address: z.string().min(1, 'Address is required'),
  phone: z.string().min(1, 'Phone is required'),
  email: z.email('Must be a valid email'),
  openingHours: z
    .string()
    .min(1, 'Opening hours required')
    .regex(/^\d{2}:\d{2}\s*[-–]\s*\d{2}:\d{2}$/, 'Format must be HH:MM - HH:MM (e.g. 08:00 - 22:00)'),
  isActive: z.boolean(),
});

export type LocationFormInput = z.input<typeof locationSchema>;
export type LocationFormOutput = z.output<typeof locationSchema>;
