import { apiClient } from './client';
import type { Cart, CartItem } from '../types/index';

export interface AddCartItemPayload {
  dishId: number;
  quantity: number;
  note?: string;
  extras?: { ingredientId: number; quantity: number }[];
}

export interface UpdateCartItemPayload {
  quantity?: number;
  note?: string | null;
}

export const cartApi = {
  getCart: async (): Promise<Cart> => {
    const res = await apiClient.get('/cart');
    return res.data;
  },

  addItem: async (payload: AddCartItemPayload): Promise<CartItem> => {
    const res = await apiClient.post('/cart/items', payload);
    return res.data;
  },

  updateItem: async (cartItemId: number, payload: UpdateCartItemPayload): Promise<CartItem | null> => {
    const res = await apiClient.patch(`/cart/items/${cartItemId}`, payload);
    return res.status === 204 ? null : res.data;
  },

  removeItem: async (cartItemId: number): Promise<void> => {
    await apiClient.delete(`/cart/items/${cartItemId}`);
  },

  clearCart: async (): Promise<void> => {
    await apiClient.delete('/cart');
  },
};
