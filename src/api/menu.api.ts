import { apiClient } from './client';
import type { Dish, DishQuery, Ingredient } from '../types/index';

export const menuApi = {
  getDishes: async (query?: DishQuery): Promise<Dish[]> => {
    const res = await apiClient.get('/dishes', { params: query });
    return res.data;
  },

  getDish: async (id: number): Promise<Dish> => {
    const res = await apiClient.get(`/dishes/${id}`);
    return res.data;
  },

  getIngredients: async (): Promise<Ingredient[]> => {
    const res = await apiClient.get('/ingredients');
    return res.data;
  },
};
