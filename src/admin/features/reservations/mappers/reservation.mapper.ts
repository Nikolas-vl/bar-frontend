import type { Reservation } from '@/shared/types/reservation.types';
import type { CreateReservationDto, UpdateReservationDto } from '../dto/reservation.dto';
import type { AdminReservationFormOutput } from '../schemas/reservation.schema';

export const mapAdminReservationToForm = (reservation: Reservation): AdminReservationFormOutput => ({
  userId: reservation.userId,
  date: reservation.date.slice(0, 16),
  guests: reservation.guests,
  tableId: reservation.tableId ?? undefined,
  status: reservation.status,
  comment: reservation.comment ?? '',
});

const mapCommonFields = (formData: AdminReservationFormOutput) => ({
  date: formData.date,
  guests: formData.guests,
  tableId: formData.tableId === 0 ? undefined : formData.tableId,
  status: formData.status,
  comment: formData.comment || undefined,
});

export const mapAdminReservationFormToDto = (formData: AdminReservationFormOutput): CreateReservationDto => ({
  userId: formData.userId,
  ...mapCommonFields(formData),
});

export const mapAdminReservationFormToUpdateDto = (
  formData: AdminReservationFormOutput,
): Omit<UpdateReservationDto, 'userId'> => mapCommonFields(formData);
