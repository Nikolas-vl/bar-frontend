import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getSocket } from '@/shared/lib/socket';
import { useAuthStore } from '@/app/store/auth.store';
import { queryKeys } from '@/shared/lib/utils/queryKeys';
import { toast } from 'sonner';
import type { NewReservationPayload, ReservationStatusPayload } from '@/shared/types/socket.types';

export const useReservationSocket = () => {
  const queryClient = useQueryClient();
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) return;

    const socket = getSocket();

    const handler = (payload: ReservationStatusPayload) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.reservations.all,
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.reservations.detail(payload.reservationId),
      });

      toast.info(`Reservation status: ${payload.status}`);
    };

    const handleNewReservation = (payload: NewReservationPayload) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.reservations.all,
      });

      toast.info(`New reservation for ${payload.guests} guests`);
    };

    socket.on('reservation:new', handleNewReservation);

    socket.on('reservation:status_updated', handler);

    return () => {
      socket.off('reservation:status_updated', handler);
      socket.off('reservation:new', handleNewReservation);
    };
  }, [isAuthenticated, queryClient]);
};
