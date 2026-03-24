import { cartApi } from '@/shared/lib/api/cart.api';
import { queryKeys } from '@/shared/lib/utils/queryKeys';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useAddIngredientToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { ingredientId: number; quantity: number; note?: string }) => cartApi.addIngredientItem(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.me });
    },
  });
};
