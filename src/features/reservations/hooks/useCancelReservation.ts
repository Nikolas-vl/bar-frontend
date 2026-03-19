import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reservationApi } from '@/api/reservation.api';
import { queryKeys } from '@/utils/queryKeys';

export const useCancelReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => reservationApi.cancelReservation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reservations.mine });
    },
  });
};
