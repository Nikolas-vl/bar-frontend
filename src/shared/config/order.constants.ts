import type { OrderStatus } from '@/shared/types';

export const ORDER_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  NEW: ['PAID', 'CANCELED'],
  PAID: ['PREPARING', 'CANCELED'],
  PREPARING: ['COMPLETED', 'CANCELED'],
  COMPLETED: [],
  CANCELED: [],
};
