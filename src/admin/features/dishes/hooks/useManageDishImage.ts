import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminDishesApi } from '@/shared/lib/api/admin/dishes.api';
import { queryKeys } from '@/shared/lib/utils/queryKeys';
import { toast } from 'sonner';
import { getErrorMessage } from '@/shared/lib/api/client';

export const useUploadDishImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ dishId, file }: { dishId: number; file: File }) => adminDishesApi.uploadImage(dishId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.dishes.all });
      toast.success('Image updated');
    },
    onError: err => toast.error(getErrorMessage(err)),
  });
};

export const useDeleteDishImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dishId: number) => adminDishesApi.deleteImage(dishId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.dishes.all });
      toast.success('Image removed');
    },
    onError: err => toast.error(getErrorMessage(err)),
  });
};
