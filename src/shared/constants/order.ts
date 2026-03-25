

export const ORDER_STATUS_CONFIG = {
  NEW: { label: 'New', color: 'gray' },
  PAID: { label: 'Paid', color: 'blue' },
  PREPARING: { label: 'Preparing', color: 'orange' },
  COMPLETED: { label: 'Completed', color: 'green' },
  CANCELED: { label: 'Canceled', color: 'red' },
} as const;

export const ORDER_STATUS_TRANSITIONS: Record<string, string[]> = {
  NEW: ['PAID', 'CANCELED'],
  PAID: ['PREPARING', 'CANCELED'],
  PREPARING: ['COMPLETED', 'CANCELED'],
  COMPLETED: [],
  CANCELED: [],
};

export const ORDER_TYPE_CONFIG = {
  DINE_IN: { label: 'Dine In', icon: '🍽️' },
  DELIVERY: { label: 'Delivery', icon: '🛵' },
  TAKE_OUT: { label: 'Take Out', icon: '🥡' },
} as const;
