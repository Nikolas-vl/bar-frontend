import { useQuery } from '@tanstack/react-query';
import { reservationApi } from '@/shared/lib/api/reservation.api';
import { queryKeys } from '@/shared/lib/utils/queryKeys';

export const useMyReservations = () =>
  useQuery({
    queryKey: queryKeys.reservations.mine,
    queryFn: reservationApi.getMyReservations,
  });
