import { useQuery } from '@tanstack/react-query';
import { menuApi } from '@/shared/lib/api/menu.api';
import { queryKeys } from '@/shared/lib/utils/queryKeys';
import type { DishQuery } from '@/shared/types';

export const useDishes = (query?: DishQuery) => {
  return useQuery({
    queryKey: queryKeys.dishes.list(query),
    queryFn: () => menuApi.getDishes(query),
  });
};
