import { useQuery } from '@tanstack/react-query';
import { menuApi } from '../../../api/menu.api';
import { queryKeys } from '../../../utils/queryKeys';
import type { DishQuery } from '../../../types/index';

export const useDishes = (query?: DishQuery) => {
  return useQuery({
    queryKey: queryKeys.dishes.list(query as Record<string, unknown>),
    queryFn: () => menuApi.getDishes(query),
  });
};
