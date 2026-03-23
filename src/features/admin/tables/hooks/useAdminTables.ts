import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminTablesApi, type CreateTableBody, type UpdateTableBody } from '@/api/admin/tables.api';
import { queryKeys } from '@/utils/queryKeys';
import { toast } from 'sonner';
import { getErrorMessage } from '@/api/client';

export const useAdminTables = (locationId?: number) =>
  useQuery({
    queryKey: queryKeys.tables.list(locationId),
    queryFn: () => adminTablesApi.getAll(locationId),
  });

export const useCreateTable = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateTableBody) => adminTablesApi.create(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tables.all });
      toast.success('Table created');
    },
    onError: err => toast.error(getErrorMessage(err)),
  });
};

export const useUpdateTable = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: UpdateTableBody }) => adminTablesApi.update(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tables.all });
      toast.success('Table updated');
    },
    onError: err => toast.error(getErrorMessage(err)),
  });
};

export const useDeleteTable = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminTablesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tables.all });
      toast.success('Table deleted');
    },
    onError: err => toast.error(getErrorMessage(err)),
  });
};
