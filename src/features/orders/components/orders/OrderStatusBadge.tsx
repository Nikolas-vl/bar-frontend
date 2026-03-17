import { cn } from '@/utils/cn';
import type { OrderStatus, PaymentStatus } from '@/types';

const STATUS_CLASS: Record<OrderStatus, string> = {
  NEW: 'badge-new',
  PAID: 'badge-paid',
  PREPARING: 'badge-preparing',
  COMPLETED: 'badge-completed',
  CANCELED: 'badge-canceled',
};

const PAYMENT_CLASS: Record<PaymentStatus, string> = {
  PENDING: 'badge-pending',
  SUCCESS: 'badge-paid',
  FAILED: 'badge-canceled',
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <span className={cn('badge', STATUS_CLASS[status])}>{status}</span>;
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return <span className={cn('badge', PAYMENT_CLASS[status])}>{status}</span>;
}
