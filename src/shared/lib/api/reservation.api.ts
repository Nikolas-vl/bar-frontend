import { apiClient } from './client';
import type { Reservation } from '@/shared/types';

export interface CreateReservationPayload {
  date: string;
  guests: number;
  comment?: string;
  preOrders?: { dishId: number; quantity: number }[];
}

export const reservationApi = {
  getMyReservations: async (): Promise<Reservation[]> => {
    const res = await apiClient.get('/reservations');
    return res.data;
  },

  getMyReservationById: async (id: number): Promise<Reservation> => {
    const res = await apiClient.get(`/reservations/${id}`);
    return res.data;
  },

  createReservation: async (payload: CreateReservationPayload): Promise<Reservation> => {
    const res = await apiClient.post('/reservations', payload);
    return res.data;
  },

  cancelReservation: async (id: number): Promise<Reservation> => {
    const res = await apiClient.patch(`/reservations/${id}/cancel`);
    return res.data;
  },
};
