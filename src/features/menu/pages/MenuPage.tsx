import { useDishes } from '../hooks/useDishes';
import { useMenuFilters } from '../hooks/useMenuFilters';
import { DishFilters } from '../components/menu/DishFilters';
import { DishGrid } from '../components/menu/DishGrid';

export default function MenuPage() {
  const { filters, setFilters } = useMenuFilters();
  const { data: dishes, isLoading, error } = useDishes(filters);

  return (
    <div className='page-container py-10'>
      <div className='mb-8'>
        <h1 className='font-display text-4xl font-semibold mb-2 text-ob-text'>Our Menu</h1>
        <p className='text-base text-ob-muted'>Fresh, seasonal dishes crafted with care</p>
      </div>

      <div className='mb-7'>
        <DishFilters value={filters} onChange={setFilters} totalCount={dishes?.length} />
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
