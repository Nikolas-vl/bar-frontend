import { useMutation, useQueryClient } from '@tanstack/react-query';
import { orderApi } from '@/shared/lib/api/order.api';
import { queryKeys } from '@/shared/lib/utils/queryKeys';

export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: number) => orderApi.cancelOrder(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
    },
  });
};
