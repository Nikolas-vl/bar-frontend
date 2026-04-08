import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getSocket } from '@/shared/lib/socket';
import { useAuthStore } from '@/app/store/auth.store';
import { queryKeys } from '@/shared/lib/utils/queryKeys';
import { toast } from 'sonner';
import type { NewOrderPayload, OrderStatusPayload } from '@/shared/types/socket.types';

export const useAdminOrderSocket = () => {
  const queryClient = useQueryClient();
  const role = useAuthStore(s => s.user?.role);

  useEffect(() => {
    if (role !== 'ADMIN') return;

    const socket = getSocket();

    const handleNewOrder = (payload: NewOrderPayload) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
      toast.info(`New order #${payload.orderId} — ${payload.type} (${payload.total})`);
    };

    const handleStatusUpdate = (payload: OrderStatusPayload) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.detail(payload.orderId) });

      toast.info(`Order #${payload.orderId} → ${payload.status}`);
    };

    socket.on('order:new', handleNewOrder);
    socket.on('order:status_updated', handleStatusUpdate);

    return () => {
      socket.off('order:new', handleNewOrder);
      socket.off('order:status_updated', handleStatusUpdate);
    };
  }, [role, queryClient]);
};
