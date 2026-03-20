import { useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentApi, type CreatePaymentMethodPayload } from '@/api/payment.api';
import { queryKeys } from '@/utils/queryKeys';

export const useCreatePaymentMethod = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePaymentMethodPayload) => paymentApi.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.paymentMethods.mine }),
  });
};

export const useSetDefaultPaymentMethod = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => paymentApi.setDefault(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.paymentMethods.mine }),
  });
};

export const useDeletePaymentMethod = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => paymentApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.paymentMethods.mine }),
  });
};
