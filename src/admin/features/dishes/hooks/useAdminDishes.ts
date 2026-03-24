import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  adminDishesApi,
  type CreateDishBody,
  type UpdateDishBody,
  type AddDishIngredientBody,
  type UpdateDishIngredientBody,
} from '@/shared/lib/api/admin/dishes.api';
import { queryKeys } from '@/shared/lib/utils/queryKeys';
import { toast } from 'sonner';
import { getErrorMessage } from '@/shared/lib/api/client';
import type { DishQuery, Dish } from '@/shared/types';

export const useAdminDishes = (filters?: DishQuery) =>
  useQuery({
    queryKey: queryKeys.dishes.list(filters),
    queryFn: () => adminDishesApi.getAll(filters),
  });

export const useCreateDish = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateDishBody) => adminDishesApi.create(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.dishes.all });
      toast.success('Dish created');
    },
    onError: err => toast.error(getErrorMessage(err)),
  });
};

export const useUpdateDish = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: UpdateDishBody }) => adminDishesApi.update(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.dishes.all });
      toast.success('Dish updated');
    },
    onError: err => toast.error(getErrorMessage(err)),
  });
};

export const useDeleteDish = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminDishesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.dishes.all });
      toast.success('Dish deleted');
    },
    onError: err => toast.error(getErrorMessage(err)),
  });
};

export const useToggleDishAvailability = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isAvailable }: { id: number; isAvailable: boolean }) =>
      adminDishesApi.update(id, { isAvailable }),
    onMutate: async ({ id, isAvailable }) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: queryKeys.dishes.all });
      const previousQueries = queryClient.getQueriesData<Dish[]>({ queryKey: queryKeys.dishes.all });
      queryClient.setQueriesData<Dish[]>({ queryKey: queryKeys.dishes.all }, old =>
        old?.map(d => (d.id === id ? { ...d, isAvailable } : d)),
      );
      return { previousQueries };
    },
    onError: (err, _vars, context) => {
      // Rollback
      context?.previousQueries.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
      toast.error(getErrorMessage(err));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.dishes.all });
    },
  });
};

export const useAddIngredientToDish = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ dishId, body }: { dishId: number; body: AddDishIngredientBody }) =>
      adminDishesApi.addIngredient(dishId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.dishes.all });
      toast.success('Ingredient added to dish');
    },
    onError: err => toast.error(getErrorMessage(err)),
  });
};

export const useUpdateDishIngredient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ dishId, ingredientId, body }: { dishId: number; ingredientId: number; body: UpdateDishIngredientBody }) =>
      adminDishesApi.updateIngredient(dishId, ingredientId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.dishes.all });
    },
    onError: err => toast.error(getErrorMessage(err)),
  });
};

export const useRemoveIngredientFromDish = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ dishId, ingredientId }: { dishId: number; ingredientId: number }) =>
      adminDishesApi.removeIngredient(dishId, ingredientId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.dishes.all });
      toast.success('Ingredient removed');
    },
    onError: err => toast.error(getErrorMessage(err)),
  });
};
