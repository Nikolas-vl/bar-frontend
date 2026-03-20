import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { addressApi, type CreateAddressPayload, type UpdateAddressPayload } from '@/api/address.api';
import { queryKeys } from '@/utils/queryKeys';

export const useAddresses = () =>
  useQuery({
    queryKey: queryKeys.addresses.mine,
    queryFn: addressApi.getAll,
  });

export const useCreateAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateAddressPayload) => addressApi.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.addresses.mine }),
  });
};

export const useUpdateAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: number } & UpdateAddressPayload) => addressApi.update(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.addresses.mine }),
  });
};

export const useDeleteAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => addressApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.addresses.mine }),
  });
};
