import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getSocket } from '@/shared/lib/socket';
import { useAuthStore } from '@/app/store/auth.store';
import { queryKeys } from '@/shared/lib/utils/queryKeys';
import { toast } from 'sonner';
import type { OrderStatusPayload } from '@/shared/types/socket.types';

const STATUS_LABELS: Record<string, string> = {
  PAID: 'Payment confirmed',
  PREPARING: 'Kitchen is preparing your order',
  COMPLETED: 'Your order is ready',
  CANCELED: 'Order was canceled',
};

export const useOrderSocket = () => {
  const queryClient = useQueryClient();
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) return;

    const socket = getSocket();

    const handleOrderUpdate = (payload: OrderStatusPayload) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.detail(payload.orderId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });

      const label = STATUS_LABELS[payload.status];
      if (label) toast.info(`🧾 ${label}`);
    };

    socket.on('order:status_updated', handleOrderUpdate);
    return () => {
      socket.off('order:status_updated', handleOrderUpdate);
    };
  }, [isAuthenticated, queryClient]);
};
