import { useQuery } from '@tanstack/react-query';
import { paymentApi } from '@/shared/lib/api/payment.api';
import { queryKeys } from '@/shared/lib/utils/queryKeys';

export const usePaymentMethods = () => {
  return useQuery({
    queryKey: queryKeys.paymentMethods.mine,
    queryFn: paymentApi.getMyPaymentMethods,
  });
};
