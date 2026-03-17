import { apiClient } from './client';
import type { Cart } from '../types/index';

export const cartApi = {
  getCart: async (): Promise<Cart> => {
    const res = await apiClient.get('/cart');
    return res.data;
  },
};
