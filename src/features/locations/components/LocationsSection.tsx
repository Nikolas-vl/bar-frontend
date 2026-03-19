import { Link } from 'react-router-dom';
import { useLocations } from '../hooks/Uselocations';
import { Skeleton } from '@/components/shared/ui';
import type { Location } from '@/types';

function mapsUrl(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

function LocationCard({ loc }: { loc: Location }) {
  return (
    <div className='card p-6 flex flex-col gap-4'>
      {/* Name + status */}
      <div className='flex items-center justify-between'>
        <h3 className='font-display font-semibold text-lg text-ob-text'>{loc.name}</h3>
        {loc.isActive ? (
          <span className='text-xs font-semibold px-2.5 py-1 rounded-full bg-ob-success/10 text-ob-success'>Open</span>
        ) : (
          <span className='text-xs font-semibold px-2.5 py-1 rounded-full bg-ob-border text-ob-muted'>Closed</span>
        )}
      </div>

      {/* Details */}
      <div className='flex flex-col gap-2 text-sm'>
        <div className='flex items-start gap-2'>
          <span className='shrink-0 mt-0.5'>📍</span>
          <a
            href={mapsUrl(loc.address)}
            target='_blank'
            rel='noopener noreferrer'
            className='text-ob-caramel underline underline-offset-2 hover:text-ob-wood transition-colors leading-snug'
          >
            {loc.address}
          </a>
        </div>
        <div className='flex items-center gap-2 text-ob-muted'>
          <span>🕐</span>
          <span>{loc.openingHours}</span>
        </div>
        <div className='flex items-center gap-2 text-ob-muted'>
          <span>📞</span>
          <a href={`tel:${loc.phone}`} className='hover:text-ob-text transition-colors'>
            {loc.phone}
          </a>
        </div>
        <div className='flex items-center gap-2 text-ob-muted'>
          <span>✉️</span>
          <a href={`mailto:${loc.email}`} className='hover:text-ob-text transition-colors'>
            {loc.email}
          </a>
        </div>
      </div>

      {/* CTA */}
      <Link to='/reservations/new' className='btn-secondary w-full justify-center text-sm mt-auto'>
        Reserve at this location
      </Link>
    </div>
  );
}

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
                <LocationCard key={loc.id} loc={loc} />
              ))}
          </div>
        )}
      </div>
    </section>
  );
}
