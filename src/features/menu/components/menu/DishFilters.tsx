import { useEffect, useRef, useCallback } from 'react';
import { cn } from '@/shared/lib/utils/cn';
import { useDebouncedSearch } from '@/shared/hooks/useDebouncedSearch';
import type { DishQuery, Category } from '@/shared/types';

interface DishFiltersProps {
  value: DishQuery;
  onChange: (q: DishQuery) => void;
  totalCount?: number;
}

import { categories, sortOptions, caloriePresets } from '../../config/filterConfig';
import { Select } from '@/shared/ui/Select';

function omitKeys<T extends object, K extends keyof T>(obj: T, ...keys: K[]): Omit<T, K> {
  const result = { ...obj };
  keys.forEach(k => delete result[k]);
  return result;
}

export function DishFilters({ value, onChange, totalCount }: DishFiltersProps) {
  const [searchInput, setSearchInput, debouncedSearch] = useDebouncedSearch(value.search ?? '', 900);

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
      if (raw === DEFAULT_SORT) {
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
  }, [value.isAvailable, onChange, setSearchInput]);

  const currentSort = value.sortBy ? `${value.sortBy}:${value.sortOrder ?? 'asc'}` : '';
  const DEFAULT_SORT = 'default';

  const activeFiltersCount = [
    value.search,
    value.category,
    value.minCalories !== undefined || value.maxCalories !== undefined ? 'calories' : undefined,
  ].filter(Boolean).length;

  return (
    <div className='flex flex-col gap-3'>
      <div className='flex flex-col sm:flex-row gap-2.5'>
        <div className='relative flex-1'>
          <span className='absolute left-3 top-1/2 -translate-y-1/2 text-sm pointer-events-none text-ob-muted'>🔍</span>
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

        <Select value={currentSort} onChange={handleSort} options={sortOptions} className='w-full sm:w-44' />
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
                  'px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 border',
                  isActive ? 'bg-ob-caramel border-ob-caramel text-white' : 'bg-ob-surface border-ob-border text-ob-muted hover:opacity-80',
                )}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        <div className='flex items-center gap-2.5 ml-auto'>
          {totalCount !== undefined && (
            <span className='text-xs text-ob-muted'>
              {totalCount} {totalCount === 1 ? 'dish' : 'dishes'}
            </span>
          )}
          {activeFiltersCount > 0 && (
            <button onClick={clearAll} className='text-xs font-semibold px-2.5 py-1 rounded-full transition-all bg-ob-caramel/10 text-ob-caramel'>
              Clear {activeFiltersCount > 1 ? `(${activeFiltersCount})` : ''}
            </button>
          )}
        </div>
      </div>

      <div className='flex items-center gap-1.5 flex-wrap'>
        <span className='text-xs font-medium mr-1 text-ob-muted'>Calories:</span>

        {caloriePresets.map(preset => {
          const isActive = preset.min === value.minCalories && preset.max === value.maxCalories;
          const isAnyActive = preset.label === 'Any' && value.minCalories === undefined && value.maxCalories === undefined;
          const selected = isAnyActive || (preset.label !== 'Any' && isActive);

          return (
            <button
              key={preset.label}
              onClick={() => handleCaloriePreset(preset.min, preset.max)}
              className={cn(
                'px-3 py-1 rounded-full text-xs font-medium transition-all duration-150 border',
                selected ? 'bg-ob-wood border-ob-wood text-white' : 'bg-ob-surface border-ob-border text-ob-muted hover:opacity-80',
              )}
            >
              {preset.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
