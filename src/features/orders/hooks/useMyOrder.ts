import { useQuery } from '@tanstack/react-query';
import { orderApi } from '@/shared/lib/api/order.api';
import { queryKeys } from '@/shared/lib/utils/queryKeys';

export const useMyOrder = (orderId: number) => {
  return useQuery({
    queryKey: queryKeys.orders.detail(orderId),
    queryFn: () => orderApi.getMyOrderById(orderId),
    enabled: !!orderId,
  });
};
