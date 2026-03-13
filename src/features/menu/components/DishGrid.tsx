import type { Dish } from '../../../types/index';
import { DishCard } from './DishCard';

interface DishGridProps {
  dishes: Dish[];
  loading?: boolean;
}

function SkeletonCard() {
  return (
    <div className='card overflow-hidden animate-pulse'>
      <div className='w-full aspect-4/3' style={{ background: 'var(--color-ob-border)' }} />
      <div className='p-4 flex flex-col gap-2'>
        <div className='h-4 rounded-md w-3/4' style={{ background: 'var(--color-ob-border)' }} />
        <div className='h-3 rounded-md w-full' style={{ background: 'var(--color-ob-border)' }} />
        <div className='h-3 rounded-md w-2/3' style={{ background: 'var(--color-ob-border)' }} />
        <div className='flex justify-between mt-2'>
          <div className='h-4 rounded-md w-16' style={{ background: 'var(--color-ob-border)' }} />
          <div className='h-4 rounded-md w-12' style={{ background: 'var(--color-ob-border)' }} />
        </div>
      </div>
    </div>
  );
}

export function DishGrid({ dishes, loading }: DishGridProps) {
  if (loading) {
    return (
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (dishes.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-20 gap-4'>
        <span className='text-5xl'>🍽️</span>
        <p className='text-base font-medium' style={{ color: 'var(--color-ob-text-muted)' }}>
          No dishes found
        </p>
        <p className='text-sm' style={{ color: 'var(--color-ob-text-muted)' }}>
          Try adjusting your filters
        </p>
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
      {dishes.map(dish => (
        <DishCard key={dish.id} dish={dish} />
      ))}
    </div>
  );
}
