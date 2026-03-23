import { useState } from 'react';

export function useFilteredPage<T extends Record<string, unknown>>(initialFilters: T) {
  const [filters, setFilters] = useState<T>(initialFilters);
  const [page, setPage] = useState(1);

  const updateFilter = <K extends keyof T>(key: K, value: T[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  return { filters, page, setPage, updateFilter };
}
