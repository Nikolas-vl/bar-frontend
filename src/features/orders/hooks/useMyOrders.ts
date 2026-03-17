import { useQuery } from '@tanstack/react-query';
import { orderApi, type OrdersQuery } from '@/api/order.api';
import { queryKeys } from '@/utils/queryKeys';

export const useMyOrders = (query?: OrdersQuery) => {
  return useQuery({
    queryKey: queryKeys.orders.mine(query),
    queryFn: () => orderApi.getMyOrders(query),
  });
};
