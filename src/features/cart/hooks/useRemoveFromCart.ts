import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cartApi } from '../../../api/cart.api';
import { queryKeys } from '../../../utils/queryKeys';

export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cartItemId: number) => cartApi.removeItem(cartItemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.me });
    },
  });
};
