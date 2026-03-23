import { useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';

export function useDebouncedSearch(delay = 500) {
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, delay);
  return [searchInput, setSearchInput, debouncedSearch] as const;
}
