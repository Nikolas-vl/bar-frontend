import { useQuery } from '@tanstack/react-query';
import { cartApi } from '@/shared/lib/api/cart.api';
import { queryKeys } from '@/shared/lib/utils/queryKeys';
import { useAuthStore } from '@/app/store/auth.store';

export const useCart = () => {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);

  return useQuery({
    queryKey: queryKeys.cart.me,
    queryFn: cartApi.getCart,
    enabled: isAuthenticated,
    staleTime: 1000 * 30,
  });
};
