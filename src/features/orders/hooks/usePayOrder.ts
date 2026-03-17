import { useMutation, useQueryClient } from '@tanstack/react-query';
import { orderApi, type PayOrderPayload } from '@/api/order.api';
import { queryKeys } from '@/utils/queryKeys';

interface PayOrderVariables extends PayOrderPayload {
  orderId: number;
}

export const usePayOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, ...payload }: PayOrderVariables) => orderApi.payOrder(orderId, payload),
    onSuccess: (_, { orderId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.detail(orderId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
    },
  });
};
