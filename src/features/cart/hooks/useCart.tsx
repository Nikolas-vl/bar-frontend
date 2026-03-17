import { useQuery } from '@tanstack/react-query';
import { cartApi } from '@/api/cart.api';
import { queryKeys } from '@/utils/queryKeys';
import { useAuthStore } from '@/store/auth.store';

export const useCart = () => {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);

  return useQuery({
    queryKey: queryKeys.cart.me,
    queryFn: cartApi.getCart,
    enabled: isAuthenticated,
    staleTime: 1000 * 30,
  });
};
