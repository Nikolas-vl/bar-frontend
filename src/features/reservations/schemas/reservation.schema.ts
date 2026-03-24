import { z } from 'zod';

function minBookingDate(): Date {
  const d = new Date();
  d.setHours(d.getHours() + 1);
  return d;
}

export const newReservationSchema = z.object({
  date: z
    .string()
    .min(1, 'Please select a date and time')
    .refine(val => new Date(val) > new Date(), { message: 'Reservation must be at least 1 hour in the future' }),
  guests: z.number({ error: 'Please enter number of guests' }).int().min(1, 'At least 1 guest required').max(50, 'Maximum 50 guests'),
  comment: z.string().max(500).optional(),
});

export type NewReservationFormData = z.infer<typeof newReservationSchema>;

/** Returns the minimum datetime-local string (now + 1h) */
export function minDateTimeLocal(): string {
  return minBookingDate().toISOString().slice(0, 16);
}
