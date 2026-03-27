import { z } from 'zod';
import { CARD_TYPES } from '@/shared/constants/payment';

const currentYear = new Date().getFullYear();

export const cardSchema = z.object({
  cardType: z.enum(CARD_TYPES, { error: 'Select a card type' }),
  last4: z
    .string()
    .length(4, 'Must be exactly 4 digits')
    .regex(/^\d{4}$/, 'Digits only'),
  expMonth: z.number({ error: 'Invalid month' }).int().min(1, 'Invalid month').max(12, 'Invalid month'),
  expYear: z
    .number({ error: 'Invalid year' })
    .int()
    .min(currentYear, `Year must be ${currentYear} or later`)
    .max(currentYear + 10, 'Year must be less than 10 years from now'),
});

export type CardFormData = z.infer<typeof cardSchema>;
