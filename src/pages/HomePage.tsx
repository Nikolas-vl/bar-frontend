import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DishCard } from '@/features/menu/components/menu/DishCard';
import { useDishes } from '@/features/menu/hooks/useDishes';
import { LocationsSection } from '@/features/locations/components/LocationsSection';
import { Skeleton } from '@/shared/ui/Skeleton';

function FeaturedSkeleton() {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5'>
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className='card overflow-hidden'>
          <Skeleton className='w-full aspect-4/3 rounded-none' />
          <div className='p-4 flex flex-col gap-2'>
            <Skeleton className='h-4 w-3/4' />
            <Skeleton className='h-3 w-full' />
            <Skeleton className='h-3 w-2/3' />
          </div>
        </div>
      ))}
    </div>
  );
}

function LocationsSkeleton() {
  return (
    <section className='bg-ob-surface border-t border-ob-border'>
      <div className='page-container py-16'>
        <div className='mb-8'>
          <Skeleton className='h-3 w-20 mb-2' />
          <Skeleton className='h-8 w-56' />
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
          <Skeleton className='h-56 rounded-2xl' />
          <Skeleton className='h-56 rounded-2xl' />
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  const [enableDeferredSections, setEnableDeferredSections] = useState(false);

  useEffect(() => {
    const browserWindow = window as Window & {
      requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
      cancelIdleCallback?: (handle: number) => void;
    };

    let timeoutHandle: number | undefined;
    let idleHandle: number | undefined;

    if (browserWindow.requestIdleCallback) {
      idleHandle = browserWindow.requestIdleCallback(() => setEnableDeferredSections(true), { timeout: 1200 });
    } else {
      timeoutHandle = window.setTimeout(() => setEnableDeferredSections(true), 280);
    }

    return () => {
      if (idleHandle !== undefined && browserWindow.cancelIdleCallback) {
        browserWindow.cancelIdleCallback(idleHandle);
      }

      if (timeoutHandle !== undefined) {
        window.clearTimeout(timeoutHandle);
      }
    };
  }, []);

  const { data: featured, isLoading: isFeaturedLoading } = useDishes(
    { isAvailable: true, sortBy: 'name', sortOrder: 'asc' },
    { enabled: enableDeferredSections },
  );

  const featuredSlice = featured?.slice(0, 4) ?? [];
  const showFeaturedSection = enableDeferredSections && (isFeaturedLoading || featuredSlice.length > 0);

  return (
    <div>
      <section
        className='relative overflow-hidden min-h-520px'
        style={{ background: 'linear-gradient(135deg, var(--color-ob-bg) 0%, var(--color-ob-surface) 50%, var(--color-ob-blue) 100%)' }}
      >
        <div
          className='absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-20 pointer-events-none'
          style={{ background: 'radial-gradient(circle, var(--color-ob-caramel), transparent)' }}
        />
        <div
          className='absolute -bottom-16 -left-16 w-64 h-64 rounded-full opacity-10 pointer-events-none'
          style={{ background: 'radial-gradient(circle, var(--color-ob-blue-deep), transparent)' }}
        />
        <div className='page-container relative z-10 py-20 flex flex-col items-start gap-7'>
          <div className='flex items-center gap-2'>
            <span className='w-6 h-px bg-ob-caramel' />
            <span className='text-xs font-semibold uppercase tracking-widest text-ob-caramel'>Jolie Brasserie Café</span>
          </div>
          <h1 className='font-display font-semibold leading-[1.1] text-ob-text' style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)' }}>
            A place where every
            <br />
            meal tells a story
          </h1>
          <p className='text-lg max-w-md leading-relaxed text-ob-muted'>Fresh, seasonal ingredients. Crafted with care. Served with warmth.</p>
          <div className='flex items-center gap-3 flex-wrap'>
            <Link to='/menu' className='btn-primary text-base px-7 py-3'>
              Explore Menu
            </Link>
            <Link to='/reservations/new' className='btn-secondary text-base px-7 py-3'>
              Reserve a Table
            </Link>
          </div>
          <div className='flex items-center gap-8 pt-4'>
            {[
              { value: '10+', label: 'Dishes' },
              { value: '2', label: 'Locations' },
              { value: '★ 4.9', label: 'Rating' },
            ].map(stat => (
              <div key={stat.label} className='flex flex-col'>
                <span className='font-display font-bold text-2xl text-ob-text'>{stat.value}</span>
                <span className='text-xs text-ob-muted'>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {showFeaturedSection && (
        <section className='page-container py-16'>
          <div className='flex items-end justify-between mb-8'>
            <div>
              <p className='text-xs font-semibold uppercase tracking-widest mb-1 text-ob-caramel'>Today&apos;s picks</p>
              <h2 className='font-display text-3xl font-semibold text-ob-text'>Featured Dishes</h2>
            </div>
            <Link to='/menu' className='text-sm font-medium transition-opacity hover:opacity-70 hidden sm:block text-ob-caramel'>
              View all
            </Link>
          </div>

          {isFeaturedLoading ? (
            <FeaturedSkeleton />
          ) : (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5'>
              {featuredSlice.map(dish => (
                <DishCard key={dish.id} dish={dish} />
              ))}
            </div>
          )}

          {!isFeaturedLoading && (
            <div className='mt-6 sm:hidden text-center'>
              <Link to='/menu' className='btn-ghost text-sm'>
                View all dishes
              </Link>
            </div>
          )}
        </section>
      )}

      {enableDeferredSections ? <LocationsSection /> : <LocationsSkeleton />}

      <section className='bg-ob-surface border-t border-ob-border'>
        <div className='page-container py-12 flex flex-col sm:flex-row items-center justify-between gap-6'>
          <div>
            <h2 className='font-display text-2xl font-semibold mb-1 text-ob-text'>Ready to dine with us?</h2>
            <p className='text-sm text-ob-muted'>Book your table in seconds, no phone call needed.</p>
          </div>
          <Link to='/reservations/new' className='btn-primary text-base px-8 py-3 shrink-0'>
            Book a table
          </Link>
        </div>
      </section>
    </div>
  );
}
