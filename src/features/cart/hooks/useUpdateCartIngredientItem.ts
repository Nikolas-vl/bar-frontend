import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cartApi } from '../../../api/cart.api';
import { queryKeys } from '../../../utils/queryKeys';

export const useUpdateCartIngredientItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ cartIngredientItemId, quantity, note }: { cartIngredientItemId: number; quantity: number; note?: string | null }) =>
      cartApi.updateIngredientItem(cartIngredientItemId, { quantity, note }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.me });
    },
  });
};
