import { cn } from '@/shared/lib/utils/cn';
import type { OrderStatus, PaymentStatus, PaymentType } from '@/shared/types';

// ─── Order status ──────────────────────────────────────────────────────────

const ORDER_STATUS_CLASS: Record<OrderStatus, string> = {
  NEW: 'badge-new',
  PAID: 'badge-paid',
  PREPARING: 'badge-preparing',
  COMPLETED: 'badge-completed',
  CANCELED: 'badge-canceled',
};

const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  NEW: 'New',
  PAID: 'Paid',
  PREPARING: 'Preparing',
  COMPLETED: 'Completed',
  CANCELED: 'Canceled',
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <span className={cn('badge', ORDER_STATUS_CLASS[status])}>{ORDER_STATUS_LABEL[status]}</span>;
}

// ─── Payment status ────────────────────────────────────────────────────────
//
// The label depends on BOTH the status and the payment type so the
// user sees a meaningful message, not a raw database enum.
//
//  CASH   + PENDING  → "Awaiting cash payment"  (pay at the counter)
//  CASH   + SUCCESS  → "Cash paid"               (staff confirmed)
//  BLIK   + PENDING  → "Processing…"
//  BLIK   + SUCCESS  → "Paid via BLIK"
//  BLIK   + FAILED   → "BLIK payment failed"
//  CARD   + PENDING  → "Processing…"
//  CARD   + SUCCESS  → "Paid by card"
//  CARD   + FAILED   → "Card payment failed"
// ──────────────────────────────────────────────────────────────────────────

type PaymentStatusBadgeProps = {
  status: PaymentStatus;
  type?: PaymentType;
};

const PAYMENT_BADGE_CLASS: Record<PaymentStatus, string> = {
  PENDING: 'badge-pending',
  SUCCESS: 'badge-paid',
  FAILED: 'badge-canceled',
};

function getPaymentLabel(status: PaymentStatus, type?: PaymentType): string {
  if (type === 'CASH') {
    if (status === 'PENDING') return 'Awaiting cash payment';
    if (status === 'SUCCESS') return 'Cash paid';
    return 'Cash payment issue';
  }

  if (type === 'BLIK') {
    if (status === 'PENDING') return 'Processing BLIK…';
    if (status === 'SUCCESS') return 'Paid via BLIK';
    return 'BLIK payment failed';
  }

  if (type === 'CARD') {
    if (status === 'PENDING') return 'Processing card…';
    if (status === 'SUCCESS') return 'Paid by card';
    return 'Card payment failed';
  }

  // Fallback when no type available (e.g. order-level paymentStatus)
  const fallback: Record<PaymentStatus, string> = {
    PENDING: 'Payment pending',
    SUCCESS: 'Payment successful',
    FAILED: 'Payment failed',
  };
  return fallback[status];
}

export function PaymentStatusBadge({ status, type }: PaymentStatusBadgeProps) {
  return <span className={cn('badge', PAYMENT_BADGE_CLASS[status])}>{getPaymentLabel(status, type)}</span>;
}
