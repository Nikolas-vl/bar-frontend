import { useMutation, useQueryClient } from '@tanstack/react-query';
import { orderApi, type CreateOrderPayload } from '@/api/order.api';
import { queryKeys } from '@/utils/queryKeys';

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateOrderPayload) => orderApi.createOrder(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.me });
    },
  });
};
