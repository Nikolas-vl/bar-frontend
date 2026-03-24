import { useQuery } from '@tanstack/react-query';
import { orderApi, type OrdersQuery } from '@/shared/lib/api/order.api';
import { queryKeys } from '@/shared/lib/utils/queryKeys';

export const useMyOrders = (query?: OrdersQuery) => {
  return useQuery({
    queryKey: queryKeys.orders.mine(query),
    queryFn: () => orderApi.getMyOrders(query),
  });
};
