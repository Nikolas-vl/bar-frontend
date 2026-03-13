import { useState } from 'react';
import { useDishes } from '../hooks/useDishes';
import { DishFilters } from '../components/DishFilters';
import { DishGrid } from '../components/DishGrid';
import type { DishQuery } from '../../../types/index';

export default function MenuPage() {
  const [query, setQuery] = useState<DishQuery>({ isAvailable: true });
  const { data: dishes, isLoading, error } = useDishes(query);

  return (
    <div className='page-container py-10'>
      {/* Header */}
      <div className='mb-8'>
        <h1 className='font-display text-4xl font-semibold mb-2' style={{ color: 'var(--color-ob-text)' }}>
          Our Menu
        </h1>
        <p className='text-base' style={{ color: 'var(--color-ob-text-muted)' }}>
          Fresh, seasonal dishes crafted with care
        </p>
      </div>

      {/* Filters */}
      <div className='mb-7'>
        <DishFilters value={query} onChange={setQuery} totalCount={dishes?.length} />
      </div>

      {/* Error state */}
      {error && (
        <div className='card p-6 text-center' style={{ borderColor: 'var(--color-ob-error)' }}>
          <p style={{ color: 'var(--color-ob-error)' }}>Failed to load dishes. Please try again.</p>
        </div>
      )}

      {/* Grid */}
      {!error && <DishGrid dishes={dishes ?? []} loading={isLoading} />}
    </div>
  );
}
