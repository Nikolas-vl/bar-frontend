import { useState, useEffect } from 'react';
import { cn } from '../../../utils/cn';
import { useDebounce } from '../../../hooks/useDebounce';
import type { DishQuery, Category } from '../../../types/index';

interface DishFiltersProps {
  value: DishQuery;
  onChange: (q: DishQuery) => void;
  totalCount?: number;
}

const categories: { value: Category | undefined; label: string }[] = [
  { value: undefined, label: 'All' },
  { value: 'BREAKFAST', label: 'Breakfast' },
  { value: 'LUNCH', label: 'Lunch' },
];

const sortOptions: { value: string; label: string }[] = [
  { value: '', label: 'Default' },
  { value: 'name:asc', label: 'Name A–Z' },
  { value: 'name:desc', label: 'Name Z–A' },
  { value: 'price:asc', label: 'Price ↑' },
  { value: 'price:desc', label: 'Price ↓' },
  { value: 'calories:asc', label: 'Calories ↑' },
  { value: 'calories:desc', label: 'Calories ↓' },
];

function omitKeys<T extends object, K extends keyof T>(obj: T, ...keys: K[]): Omit<T, K> {
  const result = { ...obj };
  keys.forEach(k => delete result[k]);
  return result;
}

export function DishFilters({ value, onChange, totalCount }: DishFiltersProps) {
  const [searchInput, setSearchInput] = useState(value.search ?? '');
  const debouncedSearch = useDebounce(searchInput);

  useEffect(() => {
    if (debouncedSearch !== (value.search ?? '')) {
      onChange({ ...value, search: debouncedSearch || undefined });
    }
  }, [debouncedSearch]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCategory = (cat: Category | undefined) => {
    onChange({ ...value, category: cat });
  };

  const handleSort = (raw: string) => {
    if (!raw) {
      onChange(omitKeys(value, 'sortBy', 'sortOrder'));
      return;
    }
    const [sortBy, sortOrder] = raw.split(':') as [DishQuery['sortBy'], DishQuery['sortOrder']];
    onChange({ ...value, sortBy, sortOrder });
  };

  const currentSort = value.sortBy ? `${value.sortBy}:${value.sortOrder ?? 'asc'}` : '';
  const activeFiltersCount = [value.search, value.category, value.sortBy].filter(Boolean).length;

  const clearAll = () => {
    setSearchInput('');
    onChange({});
  };

  return (
    <div className='flex flex-col gap-3'>
      {/* Search + sort row */}
      <div className='flex flex-col sm:flex-row gap-2.5'>
        {/* Search */}
        <div className='relative flex-1'>
          <span className='absolute left-3 top-1/2 -translate-y-1/2 text-sm pointer-events-none' style={{ color: 'var(--color-ob-text-muted)' }}>
            🔍
          </span>
          <input
            type='text'
            placeholder='Search dishes…'
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            className='input pl-9 w-full'
          />
          {searchInput && (
            <button
              onClick={() => setSearchInput('')}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-sm opacity-50 hover:opacity-100 transition-opacity'
            >
              ✕
            </button>
          )}
        </div>

        {/* Sort */}
        <select
          value={currentSort}
          onChange={e => handleSort(e.target.value)}
          className='input w-full sm:w-44 appearance-none cursor-pointer'
          style={{ backgroundImage: 'none' }}
        >
          {sortOptions.map(o => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {/* Category pills + count */}
      <div className='flex items-center justify-between gap-3 flex-wrap'>
        <div className='flex items-center gap-1.5 flex-wrap'>
          {categories.map(cat => (
            <button
              key={cat.label}
              onClick={() => handleCategory(cat.value)}
              className={cn(
                'px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-150',
                value.category === cat.value ? 'text-white' : 'hover:opacity-80',
              )}
              style={
                value.category === cat.value
                  ? { background: 'var(--color-ob-caramel)', color: '#fff' }
                  : { background: 'var(--color-ob-surface)', border: '1px solid var(--color-ob-border)', color: 'var(--color-ob-text-muted)' }
              }
            >
              {cat.label}
            </button>
          ))}

          {activeFiltersCount > 0 && (
            <button
              onClick={clearAll}
              className='px-3 py-1.5 rounded-full text-xs font-medium transition-opacity hover:opacity-80'
              style={{ color: 'var(--color-ob-error)' }}
            >
              Clear filters
            </button>
          )}
        </div>

        {totalCount !== undefined && (
          <span className='text-xs' style={{ color: 'var(--color-ob-text-muted)' }}>
            {totalCount} {totalCount === 1 ? 'dish' : 'dishes'}
          </span>
        )}
      </div>
    </div>
  );
}
