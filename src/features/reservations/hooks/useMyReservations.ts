import { useQuery } from '@tanstack/react-query';
import { reservationApi } from '@/api/reservation.api';
import { queryKeys } from '@/utils/queryKeys';

export const useMyReservations = () =>
  useQuery({
    queryKey: queryKeys.reservations.mine,
    queryFn: reservationApi.getMyReservations,
  });
