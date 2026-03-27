import type { PaymentStatus, PaymentType } from '@/shared/types';

export const PAYMENT_STATUS_CONFIG: Record<PaymentStatus, { label: string; color: string; badgeClass: string }> = {
  PENDING: { label: 'Awaiting payment', color: 'gray', badgeClass: 'badge-pending' },
  SUCCESS: { label: 'Paid', color: 'green', badgeClass: 'badge-paid' },
  FAILED: { label: 'Failed', color: 'red', badgeClass: 'badge-canceled' },
};

export const PAYMENT_TYPE_CONFIG: Record<PaymentType, { label: string; icon: string; description: string }> = {
  CASH: { label: 'Cash', icon: '💵', description: 'Pay at the counter' },
  BLIK: { label: 'BLIK', icon: '📱', description: 'Use your BLIK code' },
  CARD: { label: 'Card', icon: '💳', description: 'Pay with a saved card' },
};

export const PAYMENT_TYPE_VALUES = ['CASH', 'BLIK', 'CARD'] as const;

export const PAYMENT_TYPE_OPTIONS = PAYMENT_TYPE_VALUES.map(value => ({
  value,
  ...PAYMENT_TYPE_CONFIG[value],
}));

export const CARD_TYPES = ['Visa', 'Mastercard', 'Amex'] as const;
export type CardType = (typeof CARD_TYPES)[number];

export const CARD_TYPE_CONFIG: Record<CardType, { icon: string }> = {
  Visa: { icon: '🟦' },
  Mastercard: { icon: '🔴' },
  Amex: { icon: '🟩' },
};

export const CARD_ICON_FALLBACK = '💳';

export const CARD_TYPE_ICON = Object.fromEntries(CARD_TYPES.map(type => [type, CARD_TYPE_CONFIG[type].icon])) as Record<CardType, string>;

export function getCardTypeIcon(cardType: string): string {
  return CARD_TYPE_ICON[cardType as CardType] ?? CARD_ICON_FALLBACK;
}

export const PAYMENT_STATUS_LABEL_BY_TYPE: Record<PaymentType, Record<PaymentStatus, string>> = {
  CASH: {
    PENDING: 'Awaiting cash payment',
    SUCCESS: 'Cash paid',
    FAILED: 'Cash payment issue',
  },
  BLIK: {
    PENDING: 'Processing BLIK…',
    SUCCESS: 'Paid via BLIK',
    FAILED: 'BLIK payment failed',
  },
  CARD: {
    PENDING: 'Processing card…',
    SUCCESS: 'Paid by card',
    FAILED: 'Card payment failed',
  },
};

export const PAYMENT_STATUS_FALLBACK_LABEL: Record<PaymentStatus, string> = {
  PENDING: 'Payment pending',
  SUCCESS: 'Payment successful',
  FAILED: 'Payment failed',
};
