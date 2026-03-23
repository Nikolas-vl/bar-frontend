import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  adminReservationsApi,
  type AdminReservationsParams,
  type AdminCreateReservationBody,
  type AdminUpdateReservationBody,
} from '@/api/admin/reservations.api';
import { queryKeys } from '@/utils/queryKeys';
import { toast } from 'sonner';
import { getErrorMessage } from '@/api/client';

export const useAdminReservations = (params: AdminReservationsParams) =>
  useQuery({
    queryKey: queryKeys.reservations.admin(params),
    queryFn: () => adminReservationsApi.getAll(params),
  });

export const useAdminCreateReservation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: AdminCreateReservationBody) => adminReservationsApi.create(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reservations.all });
      toast.success('Reservation created');
    },
    onError: err => toast.error(getErrorMessage(err)),
  });
};

export const useAdminUpdateReservation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: AdminUpdateReservationBody }) =>
      adminReservationsApi.update(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reservations.all });
      toast.success('Reservation updated');
    },
    onError: err => toast.error(getErrorMessage(err)),
  });
};

export const useAdminDeleteReservation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminReservationsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reservations.all });
      toast.success('Reservation deleted');
    },
    onError: err => toast.error(getErrorMessage(err)),
  });
};
