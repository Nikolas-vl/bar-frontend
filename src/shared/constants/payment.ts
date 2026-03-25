export const PAYMENT_STATUS_CONFIG = {
  PENDING: { label: 'Awaiting payment', color: 'gray' },
  SUCCESS: { label: 'Paid', color: 'green' },
  FAILED: { label: 'Failed', color: 'red' },
} as const;

export const PAYMENT_TYPE_CONFIG = {
  CARD: { label: 'Card' },
  CASH: { label: 'Cash' },
  BLIK: { label: 'BLIK' },
} as const;
