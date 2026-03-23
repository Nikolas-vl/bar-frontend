import type { OrderStatus } from '@/types';

export const ORDER_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  NEW: ['PAID', 'CANCELED'],
  PAID: ['PREPARING', 'CANCELED'],
  PREPARING: ['COMPLETED', 'CANCELED'],
  COMPLETED: [],
  CANCELED: [],
};
