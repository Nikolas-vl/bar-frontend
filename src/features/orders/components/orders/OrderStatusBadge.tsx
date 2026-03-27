import { cn } from '@/shared/lib/utils/cn';
import { ORDER_STATUS_CONFIG } from '@/shared/constants/order';
import {
  PAYMENT_STATUS_CONFIG,
  PAYMENT_STATUS_FALLBACK_LABEL,
  PAYMENT_STATUS_LABEL_BY_TYPE,
} from '@/shared/constants/payment';
import type { OrderStatus, PaymentStatus, PaymentType } from '@/shared/types';

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const config = ORDER_STATUS_CONFIG[status];
  return <span className={cn('badge', config.badgeClass)}>{config.label}</span>;
}

type PaymentStatusBadgeProps = {
  status: PaymentStatus;
  type?: PaymentType;
};

function getPaymentLabel(status: PaymentStatus, type?: PaymentType): string {
  if (type) {
    return PAYMENT_STATUS_LABEL_BY_TYPE[type][status];
  }

  return PAYMENT_STATUS_FALLBACK_LABEL[status];
}

export function PaymentStatusBadge({ status, type }: PaymentStatusBadgeProps) {
  const config = PAYMENT_STATUS_CONFIG[status];
  return <span className={cn('badge', config.badgeClass)}>{getPaymentLabel(status, type)}</span>;
}
