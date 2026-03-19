import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reservationApi, type CreateReservationPayload } from '@/api/reservation.api';
import { queryKeys } from '@/utils/queryKeys';

export const useCreateReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateReservationPayload) => reservationApi.createReservation(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reservations.mine });
    },
  });
};
