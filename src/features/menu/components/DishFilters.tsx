import { useState, useEffect, useRef, useCallback } from 'react';
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

const caloriePresets: { label: string; min?: number; max?: number }[] = [
  { label: 'Any', min: undefined, max: undefined },
  { label: '< 300 kcal', max: 300 },
  { label: '300–600', min: 300, max: 600 },
  { label: '600–900', min: 600, max: 900 },
  { label: '900+ kcal', min: 900 },
];

function omitKeys<T extends object, K extends keyof T>(obj: T, ...keys: K[]): Omit<T, K> {
  const result = { ...obj };
  keys.forEach(k => delete result[k]);
  return result;
}

export function DishFilters({ value, onChange, totalCount }: DishFiltersProps) {
  const [searchInput, setSearchInput] = useState(value.search ?? '');
  const debouncedSearch = useDebounce(searchInput);

  const latestRef = useRef({ value, onChange });
  useEffect(() => {
    latestRef.current = { value, onChange };
  });

  useEffect(() => {
    const { value: currentValue, onChange: currentOnChange } = latestRef.current;
    if (debouncedSearch !== (currentValue.search ?? '')) {
      currentOnChange({
        ...currentValue,
        search: debouncedSearch || undefined,
      });
    }
  }, [debouncedSearch]);

  const handleCategory = useCallback(
    (cat: Category | undefined) => {
      onChange({ ...value, category: cat });
    },
    [value, onChange],
  );

  const handleSort = useCallback(
    (raw: string) => {
      if (!raw) {
        onChange(omitKeys(value, 'sortBy', 'sortOrder'));
        return;
      }
      const [sortBy, sortOrder] = raw.split(':') as [DishQuery['sortBy'], DishQuery['sortOrder']];
      onChange({ ...value, sortBy, sortOrder });
    },
    [value, onChange],
  );

  const handleCaloriePreset = useCallback(
    (min: number | undefined, max: number | undefined) => {
      onChange(
        omitKeys(
          { ...value, minCalories: min, maxCalories: max },
          ...(min === undefined ? ['minCalories' as const] : []),
          ...(max === undefined ? ['maxCalories' as const] : []),
        ),
      );
    },
    [value, onChange],
  );

  const clearAll = useCallback(() => {
    setSearchInput('');
    onChange({ isAvailable: value.isAvailable });
  }, [value.isAvailable, onChange]);

  const currentSort = value.sortBy ? `${value.sortBy}:${value.sortOrder ?? 'asc'}` : '';

  const activeFiltersCount = [
    value.search,
    value.category,
    value.minCalories !== undefined || value.maxCalories !== undefined ? 'calories' : undefined,
  ].filter(Boolean).length;

  return (
    <div className='flex flex-col gap-3'>
      <div className='flex flex-col sm:flex-row gap-2.5'>
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
              aria-label='Clear search'
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

      <div className='flex items-center justify-between gap-3 flex-wrap'>
        <div className='flex items-center gap-1.5 flex-wrap'>
          {categories.map(cat => {
            const isActive = value.category === cat.value;
            return (
              <button
                key={cat.label}
                onClick={() => handleCategory(cat.value)}
                className={cn(
                  'px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-150',
                  isActive ? 'text-white' : 'hover:opacity-80',
                )}
                style={
                  isActive
                    ? { background: 'var(--color-ob-caramel)', color: '#fff' }
                    : {
                        background: 'var(--color-ob-surface)',
                        border: '1px solid var(--color-ob-border)',
                        color: 'var(--color-ob-text-muted)',
                      }
                }
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        <div className='flex items-center gap-2.5 ml-auto'>
          {totalCount !== undefined && (
            <span className='text-xs' style={{ color: 'var(--color-ob-text-muted)' }}>
              {totalCount} {totalCount === 1 ? 'dish' : 'dishes'}
            </span>
          )}
          {activeFiltersCount > 0 && (
            <button
              onClick={clearAll}
              className='text-xs font-semibold px-2.5 py-1 rounded-full transition-all'
              style={{
                background: 'rgba(197,139,90,0.10)',
                color: 'var(--color-ob-caramel)',
              }}
            >
              Clear {activeFiltersCount > 1 ? `(${activeFiltersCount})` : ''}
            </button>
          )}
        </div>
      </div>

      <div className='flex items-center gap-1.5 flex-wrap'>
        <span className='text-xs font-medium mr-1' style={{ color: 'var(--color-ob-text-muted)' }}>
          Calories:
        </span>
        {caloriePresets.map(preset => {
          const isActive = preset.min === value.minCalories && preset.max === value.maxCalories;
          const isAnyActive = preset.label === 'Any' && value.minCalories === undefined && value.maxCalories === undefined;
          const selected = isAnyActive || (preset.label !== 'Any' && isActive);

          return (
            <button
              key={preset.label}
              onClick={() => handleCaloriePreset(preset.min, preset.max)}
              className={cn('px-3 py-1 rounded-full text-xs font-medium transition-all duration-150', selected ? 'text-white' : 'hover:opacity-80')}
              style={
                selected
                  ? { background: 'var(--color-ob-wood)', color: '#fff' }
                  : {
                      background: 'var(--color-ob-surface)',
                      border: '1px solid var(--color-ob-border)',
                      color: 'var(--color-ob-text-muted)',
                    }
              }
            >
              {preset.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
