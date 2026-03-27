import { z } from 'zod';
import { RESERVATION_STATUS_VALUES } from '@/shared/constants/reservation';

export const adminReservationSchema = z.object({
  userId: z.coerce.number().int().positive('User ID is required'),
  date: z.string().min(1, 'Date is required'),
  guests: z.coerce.number().int().min(1, 'At least 1 guest'),
  tableId: z.preprocess(v => (v === '' ? undefined : v), z.coerce.number().optional()),
  status: z.enum(RESERVATION_STATUS_VALUES),
  comment: z.string().optional(),
});

export type AdminReservationFormInput = z.input<typeof adminReservationSchema>;
export type AdminReservationFormOutput = z.output<typeof adminReservationSchema>;
