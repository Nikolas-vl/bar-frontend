import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminLocationsApi, type CreateLocationBody, type UpdateLocationBody } from '@/api/admin/locations.api';
import { queryKeys } from '@/utils/queryKeys';
import { toast } from 'sonner';
import { getErrorMessage } from '@/api/client';

export const useAdminLocations = () =>
  useQuery({
    queryKey: queryKeys.locations.all,
    queryFn: adminLocationsApi.getAll,
  });

export const useCreateLocation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateLocationBody) => adminLocationsApi.create(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.locations.all });
      toast.success('Location created');
    },
    onError: err => toast.error(getErrorMessage(err)),
  });
};

export const useUpdateLocation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: UpdateLocationBody }) => adminLocationsApi.update(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.locations.all });
      toast.success('Location updated');
    },
    onError: err => toast.error(getErrorMessage(err)),
  });
};

export const useDeleteLocation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminLocationsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.locations.all });
      toast.success('Location deleted');
    },
    onError: err => toast.error(getErrorMessage(err)),
  });
};

export const useToggleLocationActive = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
      adminLocationsApi.update(id, { isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.locations.all });
    },
    onError: err => toast.error(getErrorMessage(err)),
  });
};
