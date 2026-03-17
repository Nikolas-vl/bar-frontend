import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cartApi } from '../../../api/cart.api';
import { queryKeys } from '../../../utils/queryKeys';

export const useAddIngredientToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { ingredientId: number; quantity: number; note?: string }) =>
      cartApi.addIngredientItem(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.me });
    },
  });
};
