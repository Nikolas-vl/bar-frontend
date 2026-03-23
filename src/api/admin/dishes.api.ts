import { apiClient } from '../client';
import type { Dish, DishQuery, Ingredient } from '@/types';

export interface CreateDishBody {
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  calories?: number;
  protein?: number;
  fat?: number;
  carbs?: number;
  category?: string;
  isAvailable?: boolean;
  ingredients?: { ingredientId: number; quantity: number; optional: boolean }[];
}

export type UpdateDishBody = Partial<CreateDishBody>;

export interface AddDishIngredientBody {
  ingredientId: number;
  quantity: number;
  optional: boolean;
}

export interface UpdateDishIngredientBody {
  quantity?: number;
  optional?: boolean;
}

export const adminDishesApi = {
  getAll: (query?: DishQuery): Promise<Dish[]> => apiClient.get('/dishes', { params: query }).then(r => r.data),

  getOne: (id: number): Promise<Dish> => apiClient.get(`/dishes/${id}`).then(r => r.data),

  create: (body: CreateDishBody): Promise<Dish> => apiClient.post('/dishes', body).then(r => r.data),

  update: (id: number, body: UpdateDishBody): Promise<Dish> => apiClient.patch(`/dishes/${id}`, body).then(r => r.data),

  delete: (id: number): Promise<void> => apiClient.delete(`/dishes/${id}`).then(r => r.data),

  // Dish ingredients
  addIngredient: (dishId: number, body: AddDishIngredientBody): Promise<void> =>
    apiClient.post(`/dishes/${dishId}/ingredients`, body).then(r => r.data),

  updateIngredient: (dishId: number, ingredientId: number, body: UpdateDishIngredientBody): Promise<void> =>
    apiClient.patch(`/dishes/${dishId}/ingredients/${ingredientId}`, body).then(r => r.data),

  removeIngredient: (dishId: number, ingredientId: number): Promise<void> =>
    apiClient.delete(`/dishes/${dishId}/ingredients/${ingredientId}`).then(r => r.data),
};

// Ingredients management
export interface CreateIngredientBody {
  name: string;
  price: number;
}

export type UpdateIngredientBody = Partial<CreateIngredientBody>;

export const adminIngredientsApi = {
  getAll: (params?: { search?: string; sortBy?: string; sortOrder?: string }): Promise<Ingredient[]> =>
    apiClient.get('/ingredients', { params }).then(r => r.data),

  create: (body: CreateIngredientBody): Promise<Ingredient> => apiClient.post('/ingredients', body).then(r => r.data),

  update: (id: number, body: UpdateIngredientBody): Promise<Ingredient> => apiClient.patch(`/ingredients/${id}`, body).then(r => r.data),

  delete: (id: number): Promise<void> => apiClient.delete(`/ingredients/${id}`).then(r => r.data),
};
