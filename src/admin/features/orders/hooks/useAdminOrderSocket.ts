import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getSocket } from '@/shared/lib/socket';
import { useAuthStore } from '@/app/store/auth.store';
import { queryKeys } from '@/shared/lib/utils/queryKeys';
import { toast } from 'sonner';
import type { NewOrderPayload } from '@/shared/types/socket.types';

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

    socket.on('order:new', handleNewOrder);
    return () => {
      socket.off('order:new', handleNewOrder);
    };
  }, [role, queryClient]);
};
