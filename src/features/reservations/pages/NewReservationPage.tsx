import { Link } from 'react-router-dom';
import { NewReservationForm } from '../components/NewReservationForm';
import { useDishes } from '@/features/menu/hooks/useDishes';

export default function NewReservationPage() {
  const { data: dishes = [] } = useDishes({ isAvailable: true });

  return (
    <div className='page-container py-10'>
      <Link to='/reservations' className='inline-flex items-center gap-1.5 text-sm mb-6 hover:opacity-80 transition-opacity text-ob-muted'>
        ← My Reservations
      </Link>

      <div className='max-w-xl mx-auto'>
        <h1 className='font-display text-3xl font-semibold text-ob-text mb-1'>Reserve a Table</h1>
        <p className='text-sm text-ob-muted mb-8'>Book in seconds. Pre-order dishes so they're ready when you arrive.</p>

        <div className='card p-6'>
          <NewReservationForm dishes={dishes} />
        </div>
      </div>
    </div>
  );
}
