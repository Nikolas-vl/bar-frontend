export const ORDER_STATUS_CONFIG = {
  NEW: {
    label: 'New',
    color: 'gray',
  },
  PAID: {
    label: 'Paid',
    color: 'blue',
  },
  PREPARING: {
    label: 'Preparing',
    color: 'orange',
  },
  COMPLETED: {
    label: 'Completed',
    color: 'green',
  },
  CANCELED: {
    label: 'Canceled',
    color: 'red',
  },
} as const;

export type OrderStatus = keyof typeof ORDER_STATUS_CONFIG;

export const PAYMENT_STATUS_CONFIG = {
  PENDING: {
    label: 'Awaiting payment',
    color: 'gray',
  },
  SUCCESS: {
    label: 'Paid',
    color: 'green',
  },
  FAILED: {
    label: 'Failed',
    color: 'red',
  },
};

export type PaymentStatus = keyof typeof PAYMENT_STATUS_CONFIG;

export const RESERVATION_STATUS_CONFIG = {
  PENDING: {
    label: 'Pending',
    color: 'gray',
  },
  CONFIRMED: {
    label: 'Confirmed',
    color: 'blue',
  },
  PREPARING: {
    label: 'Preparing',
    color: 'orange',
  },
  COMPLETED: {
    label: 'Completed',
    color: 'green',
  },
  CANCELED: {
    label: 'Canceled',
    color: 'red',
  },
} as const;

export type ReservationStatus = keyof typeof RESERVATION_STATUS_CONFIG;
