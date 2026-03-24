import { useState } from 'react';
import { useDebounce } from '@/shared/hooks/useDebounce';

export function useDebouncedSearch(initial = '', delay = 500) {
  const [searchInput, setSearchInput] = useState(initial);
  const debouncedSearch = useDebounce(searchInput, delay);
  return [searchInput, setSearchInput, debouncedSearch] as const;
}
