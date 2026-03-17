import { useQuery } from '@tanstack/react-query';
import { menuApi } from '@/api/menu.api';
import { queryKeys } from '@/utils/queryKeys';

export const useDish = (id: number) => {
  return useQuery({
    queryKey: queryKeys.dishes.detail(id),
    queryFn: () => menuApi.getDish(id),
    enabled: !!id,
  });
};
