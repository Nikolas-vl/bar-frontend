import { apiClient } from './client';
import type { Order, OrderType, PaymentType, PaginatedOrders } from '../types';

export interface CreateOrderPayload {
  type: OrderType;
  comment?: string;
  discountPercent?: number;
  addressId?: number;
}

export interface PayOrderPayload {
  type: PaymentType;
  paymentMethodId?: number;
}

export interface OrdersQuery {
  status?: string;
  page?: number;
  limit?: number;
}

export const orderApi = {
  createOrder: async (payload: CreateOrderPayload): Promise<Order> => {
    const res = await apiClient.post('/orders', payload);
    return res.data;
  },

  getMyOrders: async (query?: OrdersQuery): Promise<PaginatedOrders> => {
    const res = await apiClient.get('/orders', { params: query });
    return res.data;
  },

  getMyOrderById: async (orderId: number): Promise<Order> => {
    const res = await apiClient.get(`/orders/${orderId}`);
    return res.data;
  },

  cancelOrder: async (orderId: number): Promise<Order> => {
    const res = await apiClient.patch(`/orders/${orderId}/cancel`);
    return res.data;
  },

  payOrder: async (orderId: number, payload: PayOrderPayload): Promise<{ success: boolean; message: string }> => {
    const res = await apiClient.post(`/orders/${orderId}/pay`, payload);
    return res.data;
  },
};
