import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

function parsePage(rawValue: string | null): number {
  if (!rawValue) return 1;

  const parsed = Number(rawValue);
  if (!Number.isInteger(parsed) || parsed <= 0) return 1;

  return parsed;
}

export function useFilteredPage<T extends Record<string, unknown>>(initialFilters: T) {
  const [searchParams, setSearchParams] = useSearchParams();
  const paramsKey = searchParams.toString();

  const filters = useMemo(() => {
    const params = new URLSearchParams(paramsKey);
    const resolved = {} as T;

    for (const key of Object.keys(initialFilters) as Array<keyof T>) {
      const rawValue = params.get(String(key));
      resolved[key] = (rawValue ?? initialFilters[key]) as T[keyof T];
    }

    return resolved;
  }, [paramsKey, initialFilters]);

  const page = useMemo(() => {
    return parsePage(new URLSearchParams(paramsKey).get('page'));
  }, [paramsKey]);

  const updateFilter = useCallback(
    <K extends keyof T>(key: K, value: T[K]) => {
      setSearchParams(currentParams => {
        const nextParams = new URLSearchParams(currentParams);
        const initialValue = initialFilters[key];

        const shouldDelete = value === initialValue || value === '' || value === 'ALL';

        if (shouldDelete) {
          nextParams.delete(String(key));
        } else {
          nextParams.set(String(key), String(value));
        }

        // reset pagination on filter change
        nextParams.delete('page');

        return nextParams;
      });
    },
    [setSearchParams, initialFilters],
  );

  const setPage = useCallback(
    (newPage: number) => {
      setSearchParams(currentParams => {
        const nextParams = new URLSearchParams(currentParams);
        const normalizedPage = Number.isInteger(newPage) ? newPage : 1;

        if (normalizedPage <= 1) {
          nextParams.delete('page');
        } else {
          nextParams.set('page', String(normalizedPage));
        }

        return nextParams;
      });
    },
    [setSearchParams],
  );

  const resetFilters = useCallback(() => {
    setSearchParams(currentParams => {
      const nextParams = new URLSearchParams(currentParams);

      for (const key of Object.keys(initialFilters)) {
        nextParams.delete(key);
      }

      nextParams.delete('page');

      return nextParams;
    });
  }, [setSearchParams, initialFilters]);

  return { filters, page, setPage, updateFilter, resetFilters };
}
