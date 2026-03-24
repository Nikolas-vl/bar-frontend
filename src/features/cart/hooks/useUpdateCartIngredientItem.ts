import { cartApi } from '@/shared/lib/api/cart.api';
import { queryKeys } from '@/shared/lib/utils/queryKeys';
import { useMutation, useQueryClient } from '@tanstack/react-query';

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
