import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminOrdersApi, type AdminOrdersParams } from '@/api/admin/orders.api';
import { queryKeys } from '@/utils/queryKeys';
import { toast } from 'sonner';
import { getErrorMessage } from '@/api/client';
import type { OrderStatus } from '@/types';

export const useAdminOrders = (params: AdminOrdersParams) =>
  useQuery({
    queryKey: queryKeys.orders.admin(params),
    queryFn: () => adminOrdersApi.getAll(params),
  });

export const useAdminUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: OrderStatus }) => adminOrdersApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
      toast.success('Order status updated');
    },
    onError: err => toast.error(getErrorMessage(err)),
  });
};

export const useAdminDeleteOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminOrdersApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
      toast.success('Order deleted');
    },
    onError: err => toast.error(getErrorMessage(err)),
  });
};
