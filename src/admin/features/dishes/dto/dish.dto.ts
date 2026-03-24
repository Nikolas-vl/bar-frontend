export interface CreateDishDto {
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
}

export type UpdateDishDto = Partial<CreateDishDto>;

export interface AddDishIngredientDto {
  ingredientId: number;
  quantity: number;
  optional: boolean;
}

export interface UpdateDishIngredientDto {
  quantity?: number;
  optional?: boolean;
}
