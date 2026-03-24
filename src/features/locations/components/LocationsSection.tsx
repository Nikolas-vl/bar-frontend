import { Link } from 'react-router-dom';
import { useLocations } from '../hooks/Uselocations';
import { Skeleton } from '@/shared/ui';
import { LocationInfoCard } from './LocationInfoCard';

export function LocationsSection() {
  const { data: locations, isLoading } = useLocations();

  return (
    <section className='bg-ob-surface border-t border-ob-border'>
      <div className='page-container py-16'>
        <div className='mb-8'>
          <p className='text-xs font-semibold uppercase tracking-widest mb-1 text-ob-caramel'>Find us</p>
          <h2 className='font-display text-3xl font-semibold text-ob-text'>Our Locations</h2>
        </div>

        {isLoading && (
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
            <Skeleton className='h-56 rounded-2xl' />
            <Skeleton className='h-56 rounded-2xl' />
          </div>
        )}

        {!isLoading && locations && (
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
            {locations
              .filter(l => l.isActive)
              .map(loc => (
                <LocationInfoCard
                  key={loc.id}
                  location={loc}
                  footer={
                    <Link to='/reservations/new' className='btn-secondary w-full justify-center text-sm'>
                      Reserve at this location
                    </Link>
                  }
                />
              ))}
          </div>
        )}
      </div>
    </section>
  );
}
