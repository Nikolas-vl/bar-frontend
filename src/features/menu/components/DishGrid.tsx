import type { Dish } from '../../../types/index';
import { DishCard } from './DishCard';
import { Skeleton } from '../../../components/shared/ui/Skeleton';

interface DishGridProps {
  dishes: Dish[];
  loading?: boolean;
}

function SkeletonCard() {
  return (
    <div className='card overflow-hidden'>
      <Skeleton className='w-full aspect-4/3 rounded-none' />

      <div className='p-4 flex flex-col gap-2'>
        <Skeleton className='h-4 w-3/4' />
        <Skeleton className='h-3 w-full' />
        <Skeleton className='h-3 w-2/3' />
        <div className='flex justify-between mt-2'>
          <Skeleton className='h-4 w-16' />
          <Skeleton className='h-4 w-12' />
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
        <p className='text-base font-medium text-ob-muted'>No dishes found</p>
        <p className='text-sm text-ob-muted'>Try adjusting your filters</p>
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
