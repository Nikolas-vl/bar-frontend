import { Link } from 'react-router-dom';
import { useMyReservations } from '../hooks/useMyReservations';
import { ReservationCard } from '../components/ReservationCard';
import { Skeleton } from '@/components/shared/ui';

export default function ReservationsPage() {
  const { data: reservations, isLoading } = useMyReservations();

  const now = new Date();

  const upcoming = (reservations ?? [])
    .filter(r => new Date(r.date) >= now && r.status !== 'CANCELED')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // soonest first

  const past = (reservations ?? [])
    .filter(r => new Date(r.date) < now || r.status === 'CANCELED')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // most recent first

  return (
    <div className='page-container py-10'>
      <div className='flex items-start justify-between mb-8'>
        <div>
          <h1 className='font-display text-3xl font-semibold text-ob-text mb-1'>My Reservations</h1>
          <p className='text-sm text-ob-muted'>Manage your table bookings</p>
        </div>
        <Link to='/reservations/new' className='btn-primary shrink-0'>
          + New Reservation
        </Link>
      </div>

      {isLoading && (
        <div className='flex flex-col gap-4'>
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className='h-36 rounded-2xl' />
          ))}
        </div>
      )}

      {!isLoading && reservations?.length === 0 && (
        <div className='flex flex-col items-center py-20 gap-3 text-center'>
          <span className='text-5xl'>📅</span>
          <p className='font-display font-semibold text-ob-text'>No reservations yet</p>
          <p className='text-sm text-ob-muted'>Book a table and we'll have it ready for you</p>
          <Link to='/reservations/new' className='btn-primary mt-2'>
            Reserve a Table
          </Link>
        </div>
      )}

      {!isLoading && upcoming.length > 0 && (
        <section className='mb-10'>
          <h2 className='font-display text-lg font-semibold text-ob-text mb-4'>Upcoming</h2>
          <div className='flex flex-col gap-4'>
            {upcoming.map(r => (
              <ReservationCard key={r.id} reservation={r} />
            ))}
          </div>
        </section>
      )}

      {!isLoading && past.length > 0 && (
        <section>
          <h2 className='font-display text-lg font-semibold text-ob-muted mb-4'>Past & Canceled</h2>
          <div className='flex flex-col gap-4 opacity-70'>
            {past.map(r => (
              <ReservationCard key={r.id} reservation={r} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
