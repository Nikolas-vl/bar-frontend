import { CATEGORY_CONFIG } from '@/shared/constants/category';

export type Category = keyof typeof CATEGORY_CONFIG;

export interface Ingredient {
  id: number;
  name: string;
  price: string;
}

export interface DishIngredient {
  ingredientId: number;
  quantity: number;
  optional: boolean;
  ingredient: Ingredient;
}

export interface Dish {
  id: number;
  name: string;
  description: string | null;
  price: string;
  imageUrl: string | null;
  calories: number | null;
  protein: number | null;
  fat: number | null;
  carbs: number | null;
  category: Category;
  isAvailable: boolean;
  ingredients: DishIngredient[];
}

export interface DishQuery {
  search?: string;
  category?: Category;
  minPrice?: number;
  maxPrice?: number;
  minCalories?: number;
  maxCalories?: number;
  isAvailable?: boolean;
  sortBy?: 'name' | 'price' | 'calories' | 'protein' | 'fat' | 'carbs';
  sortOrder?: 'asc' | 'desc';
}

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
