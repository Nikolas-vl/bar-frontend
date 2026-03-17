import { Link } from 'react-router-dom';
import { DishCard } from '../features/menu/components/DishCard';
import { useDishes } from '../features/menu/hooks/useDishes';

export default function HomePage() {
  const { data: featured } = useDishes({ isAvailable: true, sortBy: 'name', sortOrder: 'asc' });
  const featuredSlice = featured?.slice(0, 4) ?? [];

  return (
    <div>
      <section
        className='relative overflow-hidden min-h-[520px]'
        style={{
          background: 'linear-gradient(135deg, var(--color-ob-bg) 0%, var(--color-ob-surface) 50%, var(--color-ob-blue) 100%)',
        }}
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
            ].map(s => (
              <div key={s.label} className='flex flex-col'>
                <span className='font-display font-bold text-2xl text-ob-text'>{s.value}</span>
                <span className='text-xs text-ob-muted'>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {featuredSlice.length > 0 && (
        <section className='page-container py-16'>
          <div className='flex items-end justify-between mb-8'>
            <div>
              <p className='text-xs font-semibold uppercase tracking-widest mb-1 text-ob-caramel'>Today's picks</p>
              <h2 className='font-display text-3xl font-semibold text-ob-text'>Featured Dishes</h2>
            </div>
            <Link to='/menu' className='text-sm font-medium transition-opacity hover:opacity-70 hidden sm:block text-ob-caramel'>
              View all →
            </Link>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5'>
            {featuredSlice.map(dish => (
              <DishCard key={dish.id} dish={dish} />
            ))}
          </div>

          <div className='mt-6 sm:hidden text-center'>
            <Link to='/menu' className='btn-ghost text-sm'>
              View all dishes →
            </Link>
          </div>
        </section>
      )}
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
