import { useQuery } from '@tanstack/react-query';
import { paymentApi } from '../../../api/payment.api';
import { queryKeys } from '../../../utils/queryKeys';

export const usePaymentMethods = () => {
  return useQuery({
    queryKey: queryKeys.paymentMethods.mine,
    queryFn: paymentApi.getMyPaymentMethods,
  });
};
