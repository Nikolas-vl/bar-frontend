import type { Dish } from '@/shared/types/menu.types';
import type { CreateDishDto } from '../dto/dish.dto';
import type { DishFormInput, DishFormOutput } from '../schemas/dish.schema';

export const mapDishToForm = (dish: Dish): DishFormInput => ({
  name: dish.name,
  description: dish.description ?? undefined,
  price: parseFloat(dish.price),
  imageUrl: dish.imageUrl ?? undefined,
  calories: dish.calories ?? undefined,
  protein: dish.protein ?? undefined,
  fat: dish.fat ?? undefined,
  carbs: dish.carbs ?? undefined,
  category: dish.category,
  isAvailable: dish.isAvailable,
});

export const mapDishFormToDto = (formData: DishFormOutput): CreateDishDto => ({
  name: formData.name,
  description: formData.description,
  price: formData.price,
  imageUrl: formData.imageUrl,
  calories: formData.calories,
  protein: formData.protein,
  fat: formData.fat,
  carbs: formData.carbs,
  category: formData.category,
  isAvailable: formData.isAvailable,
});
