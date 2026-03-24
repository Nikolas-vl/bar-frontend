import { cartApi } from '@/shared/lib/api/cart.api';
import { queryKeys } from '@/shared/lib/utils/queryKeys';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface UpdatePayload {
  cartItemId: number;
  quantity?: number;
  note?: string | null;
}

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ cartItemId, ...payload }: UpdatePayload) => cartApi.updateItem(cartItemId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.me });
    },
  });
};
