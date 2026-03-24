import { apiClient } from '../client';
import type { Reservation, ReservationStatus, PaginatedReservations } from '@/shared/types';

export interface AdminReservationsParams {
  status?: string;
  date?: string;
  tableId?: number;
  page?: number;
  limit?: number;
}

export interface AdminCreateReservationBody {
  userId: number;
  date: string;
  guests: number;
  comment?: string;
  tableId?: number;
  status?: ReservationStatus;
  preOrders?: { dishId: number; quantity: number }[];
}

export interface AdminUpdateReservationBody {
  date?: string;
  guests?: number;
  tableId?: number | null;
  status?: ReservationStatus;
  comment?: string;
  preOrders?: { dishId: number; quantity: number }[];
}

export const adminReservationsApi = {
  getAll: (params?: AdminReservationsParams): Promise<PaginatedReservations> =>
    apiClient.get('/reservations/admin/all', { params }).then(r => r.data),

  create: (body: AdminCreateReservationBody): Promise<Reservation> => apiClient.post('/reservations/admin', body).then(r => r.data),

  update: (id: number, body: AdminUpdateReservationBody): Promise<Reservation> =>
    apiClient.patch(`/reservations/admin/${id}`, body).then(r => r.data),

  delete: (id: number): Promise<void> => apiClient.delete(`/reservations/admin/${id}`).then(r => r.data),
};
