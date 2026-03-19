import { format } from 'date-fns';
import { toast } from 'sonner';
import { ReservationStatusBadge } from './ReservationStatusBadge';
import { useCancelReservation } from '../hooks/useCancelReservation';
import { Spinner } from '@/components/shared/ui';
import { getErrorMessage } from '@/api/client';
import { formatPrice } from '@/utils/cn';
import type { Reservation } from '@/types';

interface ReservationCardProps {
  reservation: Reservation;
}

function mapsUrl(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

function PendingBanner({ hasTable }: { hasTable: boolean }) {
  return (
    <div className='rounded-xl bg-ob-blue border border-ob-blue-deep px-4 py-3 flex gap-3'>
      <span className='text-lg shrink-0'>⏳</span>
      <div className='flex flex-col gap-0.5'>
        <p className='text-sm font-semibold text-ob-text'>Awaiting confirmation</p>
        <p className='text-xs text-ob-muted leading-relaxed'>
          Our team will review your request and confirm your reservation shortly.
          {hasTable ? ' Table and location details are shown above.' : ' Table and location will be assigned when confirmed.'} A confirmation email
          will be sent to you once approved.
        </p>
      </div>
    </div>
  );
}

function ConfirmedBanner() {
  return (
    <div className='rounded-xl bg-ob-success/10 border border-ob-success/30 px-4 py-3 flex gap-3'>
      <span className='text-lg shrink-0'>✅</span>
      <div className='flex flex-col gap-0.5'>
        <p className='text-sm font-semibold text-ob-text'>Reservation confirmed</p>
        <p className='text-xs text-ob-muted leading-relaxed'>Your table is reserved and ready. Check your email for full details and directions.</p>
      </div>
    </div>
  );
}

export function ReservationCard({ reservation }: ReservationCardProps) {
  const { mutate: cancel, isPending } = useCancelReservation();

  const isCancelable = (reservation.status === 'PENDING' || reservation.status === 'CONFIRMED') && new Date(reservation.date) > new Date();

  const handleCancel = () => {
    cancel(reservation.id, {
      onSuccess: () => toast.success('Reservation canceled'),
      onError: err => toast.error(getErrorMessage(err)),
    });
  };

  const loc = reservation.table?.location;

  return (
    <div className='card p-5 flex flex-col gap-4'>
      {/* Header */}
      <div className='flex items-start justify-between gap-3'>
        <div>
          <p className='font-display font-semibold text-ob-text'>{format(new Date(reservation.date), 'EEEE, MMMM d, yyyy')}</p>
          <p className='text-sm text-ob-muted mt-0.5'>
            🕐 {format(new Date(reservation.date), 'HH:mm')}
            &nbsp;·&nbsp; 👥 {reservation.guests} {reservation.guests === 1 ? 'guest' : 'guests'}
          </p>
        </div>
        <ReservationStatusBadge status={reservation.status} />
      </div>

      {/* Location row */}
      {loc ? (
        <div className='flex flex-wrap items-start gap-x-3 gap-y-1 text-sm'>
          <div className='flex items-center gap-1.5'>
            <span>📍</span>
            <span className='font-medium text-ob-text'>{loc.name}</span>
            <span className='text-ob-border mx-0.5'>·</span>
            {/* Address → clickable Google Maps link */}
            <a
              href={mapsUrl(loc.address)}
              target='_blank'
              rel='noopener noreferrer'
              className='text-ob-caramel underline underline-offset-2 hover:text-ob-wood transition-colors'
            >
              {loc.address}
            </a>
          </div>
          <div className='flex items-center gap-1.5 text-ob-muted'>
            <span>🪑 Table #{reservation.table!.number}</span>
            <span className='text-ob-border mx-0.5'>·</span>
            <span>🕐 {loc.openingHours}</span>
          </div>
        </div>
      ) : reservation.status === 'PENDING' ? (
        <p className='text-xs text-ob-muted'>📍 Location &amp; table will be assigned upon confirmation</p>
      ) : null}

      {/* Status banners */}
      {reservation.status === 'PENDING' && <PendingBanner hasTable={!!loc} />}
      {reservation.status === 'CONFIRMED' && <ConfirmedBanner />}

      {/* Comment */}
      {reservation.comment && <p className='text-sm italic text-ob-muted border-t border-ob-border pt-3'>"{reservation.comment}"</p>}

      {/* Pre-orders */}
      {reservation.preOrders.length > 0 && (
        <div className='border-t border-ob-border pt-3'>
          <p className='text-xs font-semibold uppercase tracking-wider text-ob-muted mb-2'>Pre-ordered dishes</p>
          <div className='flex flex-col gap-1'>
            {reservation.preOrders.map(po => (
              <div key={po.id} className='flex items-center justify-between text-sm'>
                <span className='text-ob-text'>{po.dish.name}</span>
                <div className='flex items-center gap-3'>
                  <span className='text-ob-muted'>×{po.quantity}</span>
                  <span className='font-semibold text-ob-caramel'>{formatPrice((parseFloat(po.dish.price) * po.quantity).toFixed(2))}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cancel */}
      {isCancelable && (
        <button
          onClick={handleCancel}
          disabled={isPending}
          className='btn-outline border-ob-error text-ob-error hover:bg-ob-error/5 w-full justify-center mt-1'
        >
          {isPending ? <Spinner variant='caramel' /> : 'Cancel Reservation'}
        </button>
      )}

      {/* Canceled */}
      {reservation.status === 'CANCELED' && (
        <div className='rounded-xl bg-ob-border/30 px-4 py-3 flex gap-3'>
          <span className='text-lg shrink-0'>❌</span>
          <p className='text-xs text-ob-muted leading-relaxed'>
            This reservation has been canceled.{' '}
            <a href='/reservations/new' className='underline text-ob-caramel'>
              Make a new booking
            </a>
            .
          </p>
        </div>
      )}
    </div>
  );
}
