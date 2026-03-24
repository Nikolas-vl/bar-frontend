import { apiClient } from './client';
import type { Cart, CartItem, CartIngredientItem } from '../types/index';

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

export interface UpdateIngredientItemPayload {
  quantity?: number;
  note?: string | null;
}

export const cartApi = {
  getCart: async (): Promise<Cart> => {
    const res = await apiClient.get('/cart');
    return res.data;
  },

  // ── Dish items ────────────────────────────────────────────────────────────

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

  // ── Extras on a cart item ─────────────────────────────────────────────────

  addExtra: async (cartItemId: number, payload: { ingredientId: number; quantity: number }): Promise<void> => {
    await apiClient.post(`/cart/items/${cartItemId}/extras`, payload);
  },

  removeExtra: async (cartItemId: number, ingredientId: number): Promise<void> => {
    await apiClient.delete(`/cart/items/${cartItemId}/extras/${ingredientId}`);
  },

  // ── Standalone ingredient items ───────────────────────────────────────────

  addIngredientItem: async (payload: { ingredientId: number; quantity: number; note?: string }): Promise<CartIngredientItem> => {
    const res = await apiClient.post('/cart/ingredients', payload);
    return res.data;
  },

  updateIngredientItem: async (itemId: number, payload: UpdateIngredientItemPayload): Promise<CartIngredientItem | null> => {
    const res = await apiClient.patch(`/cart/ingredients/${itemId}`, payload);
    return res.status === 204 ? null : res.data;
  },

  removeIngredientItem: async (itemId: number): Promise<void> => {
    await apiClient.delete(`/cart/ingredients/${itemId}`);
  },
};
