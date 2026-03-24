import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cartApi } from '@/shared/lib/api/cart.api';
import { queryKeys } from '@/shared/lib/utils/queryKeys';

export const useClearCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cartApi.clearCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.me });
    },
  });
};
