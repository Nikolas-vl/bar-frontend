import { cn } from '@/shared/lib/utils/cn';
import { RESERVATION_STATUS_CONFIG } from '@/shared/constants/reservation';
import type { ReservationStatus } from '@/shared/types';

export function ReservationStatusBadge({ status }: { status: ReservationStatus }) {
  const config = RESERVATION_STATUS_CONFIG[status];
  return <span className={cn('badge', config.badgeClass)}>{config.label}</span>;
}
