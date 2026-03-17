import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { cartApi, type AddCartItemPayload } from '../../../api/cart.api';
import { queryKeys } from '../../../utils/queryKeys';
import { getErrorMessage } from '../../../api/client';
import { useUIStore } from '../../../store/ui.store';

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  const openCart = useUIStore(s => s.openCart);

  return useMutation({
    mutationFn: (payload: AddCartItemPayload) => cartApi.addItem(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.me });
      openCart();
    },
    onError: err => {
      toast.error(getErrorMessage(err));
    },
  });
};
