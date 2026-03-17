import { useQuery } from '@tanstack/react-query';
import { menuApi } from '@/api/menu.api';
import { queryKeys } from '@/utils/queryKeys';

export function useIngredients() {
  return useQuery({
    queryKey: queryKeys.ingredients.all,
    queryFn: menuApi.getIngredients,
  });
}
