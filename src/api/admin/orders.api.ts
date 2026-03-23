import { apiClient } from '../client';
import type { Order, OrderStatus, PaginatedOrders } from '@/types';

export interface AdminOrdersParams {
  status?: string;
  page?: number;
  limit?: number;
}

export const adminOrdersApi = {
  getAll: (params?: AdminOrdersParams): Promise<PaginatedOrders> =>
    apiClient.get('/orders/admin/all', { params }).then(r => r.data),

  getOne: (id: number): Promise<Order> =>
    apiClient.get(`/orders/admin/${id}`).then(r => r.data),

  updateStatus: (id: number, status: OrderStatus): Promise<Order> =>
    apiClient.patch(`/orders/admin/${id}/status`, { status }).then(r => r.data),

  delete: (id: number): Promise<void> =>
    apiClient.delete(`/orders/admin/${id}`).then(r => r.data),
};
