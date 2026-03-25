import { apiClient } from './client';
import type { PaymentMethod } from '../../types';

export interface CreatePaymentMethodPayload {
  cardType: string;
  last4: string;
  expMonth: number;
  expYear: number;
}

export interface DeletePaymentMethodResult {
  success: boolean;
  archived: boolean;
  message: string;
}

export const paymentApi = {
  getMyPaymentMethods: async (): Promise<PaymentMethod[]> => {
    const res = await apiClient.get('/payment');
    return res.data;
  },

  create: async (payload: CreatePaymentMethodPayload): Promise<PaymentMethod> => {
    const res = await apiClient.post('/payment', payload);
    return res.data;
  },

  setDefault: async (id: number): Promise<void> => {
    await apiClient.patch(`/payment/${id}/default`);
  },

  delete: async (id: number): Promise<DeletePaymentMethodResult> => {
    const res = await apiClient.delete(`/payment/${id}`);
    return res.data;
  },
};
