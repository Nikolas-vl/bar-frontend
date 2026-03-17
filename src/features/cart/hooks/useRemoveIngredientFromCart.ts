import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cartApi } from '../../../api/cart.api';
import { queryKeys } from '../../../utils/queryKeys';

export const useRemoveIngredientFromCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: number) => cartApi.removeIngredientItem(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.me });
    },
  });
};
