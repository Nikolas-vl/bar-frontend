import { useState } from 'react';
import { useDishes } from '../hooks/useDishes';
import { DishFilters } from '../components/DishFilters';
import { DishGrid } from '../components/DishGrid';
import type { DishQuery } from '@/types';

export default function MenuPage() {
  const [query, setQuery] = useState<DishQuery>({ isAvailable: true });
  const { data: dishes, isLoading, error } = useDishes(query);

  return (
    <div className='page-container py-10'>
      <div className='mb-8'>
        <h1 className='font-display text-4xl font-semibold mb-2 text-ob-text'>Our Menu</h1>
        <p className='text-base text-ob-muted'>Fresh, seasonal dishes crafted with care</p>
      </div>

      <div className='mb-7'>
        <DishFilters value={query} onChange={setQuery} totalCount={dishes?.length} />
      </div>

      {error && (
        <div className='card p-6 text-center border-ob-error'>
          <p className='text-ob-error'>Failed to load dishes. Please try again.</p>
        </div>
      )}

      {!error && <DishGrid dishes={dishes ?? []} loading={isLoading} />}
    </div>
  );
}
