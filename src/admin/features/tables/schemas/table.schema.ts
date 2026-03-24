import { z } from 'zod';

export const tableSchema = z.object({
  number: z.coerce.number().int().positive('Must be a positive integer'),
  capacity: z.coerce.number().int().min(1, 'Min capacity is 1'),
  locationId: z.coerce.number().int().positive('Select a location'),
});

export type TableFormInput = z.input<typeof tableSchema>;
export type TableFormOutput = z.output<typeof tableSchema>;
