import { cartApi } from '@/shared/lib/api/cart.api';
import { queryKeys } from '@/shared/lib/utils/queryKeys';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useRemoveIngredientFromCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: number) => cartApi.removeIngredientItem(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.me });
    },
  });
};
