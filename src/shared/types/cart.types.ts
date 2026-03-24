import type { Dish, Ingredient } from './menu.types';

export interface CartItemExtra {
  id: number;
  ingredientId: number;
  quantity: number;
  note: string | null;
  ingredient: Ingredient;
}

export interface CartItem {
  id: number;
  dishId: number;
  quantity: number;
  note: string | null;
  dish: Dish;
  extras: CartItemExtra[];
}

export interface CartIngredientItem {
  id: number;
  ingredientId: number;
  quantity: number;
  note: string | null;
  ingredient: Ingredient;
}

export interface Cart {
  id: number;
  items: CartItem[];
  ingredientItems: CartIngredientItem[];
}
