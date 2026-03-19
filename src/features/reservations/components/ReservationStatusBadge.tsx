import { cn } from '@/utils/cn';
import type { ReservationStatus } from '@/types';

const CLASS: Record<ReservationStatus, string> = {
  PENDING: 'badge-pending',
  CONFIRMED: 'badge-confirmed',
  CANCELED: 'badge-canceled',
};

const LABEL: Record<ReservationStatus, string> = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  CANCELED: 'Canceled',
};

export function ReservationStatusBadge({ status }: { status: ReservationStatus }) {
  return <span className={cn('badge', CLASS[status])}>{LABEL[status]}</span>;
}
