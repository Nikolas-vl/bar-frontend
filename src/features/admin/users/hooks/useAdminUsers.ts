import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminUsersApi, type AdminUsersParams, type AdminUpdateUserBody } from '@/api/admin/users.api';
import { queryKeys } from '@/utils/queryKeys';
import { toast } from 'sonner';
import { getErrorMessage } from '@/api/client';

export const useAdminUsers = (params: AdminUsersParams) =>
  useQuery({
    queryKey: queryKeys.users.list(params),
    queryFn: () => adminUsersApi.getAll(params),
  });

export const useAdminUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: AdminUpdateUserBody }) => adminUsersApi.update(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      toast.success('User updated');
    },
    onError: err => toast.error(getErrorMessage(err)),
  });
};

export const useAdminDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminUsersApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      toast.success('User deleted');
    },
    onError: err => toast.error(getErrorMessage(err)),
  });
};
