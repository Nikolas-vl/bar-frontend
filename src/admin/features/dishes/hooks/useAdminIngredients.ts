import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminIngredientsApi, type CreateIngredientBody, type UpdateIngredientBody } from '@/shared/lib/api/admin/dishes.api';
import { queryKeys } from '@/shared/lib/utils/queryKeys';
import { toast } from 'sonner';
import { getErrorMessage } from '@/shared/lib/api/client';

export const useAdminIngredients = (params?: { search?: string }) =>
  useQuery({
    queryKey: queryKeys.ingredients.list(params),
    queryFn: () => adminIngredientsApi.getAll(params),
  });

export const useCreateIngredient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateIngredientBody) => adminIngredientsApi.create(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.ingredients.all });
      toast.success('Ingredient created');
    },
    onError: err => toast.error(getErrorMessage(err)),
  });
};

export const useUpdateIngredient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: UpdateIngredientBody }) => adminIngredientsApi.update(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.ingredients.all });
      toast.success('Ingredient updated');
    },
    onError: err => toast.error(getErrorMessage(err)),
  });
};

export const useDeleteIngredient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminIngredientsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.ingredients.all });
      toast.success('Ingredient deleted');
    },
    onError: err => toast.error(getErrorMessage(err)),
  });
};
