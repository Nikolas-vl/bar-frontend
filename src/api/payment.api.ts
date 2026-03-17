import { apiClient } from './client';
import type { PaymentMethod } from '../types';

export const paymentApi = {
  getMyPaymentMethods: async (): Promise<PaymentMethod[]> => {
    const res = await apiClient.get('/payment');
    return res.data;
  },
};
