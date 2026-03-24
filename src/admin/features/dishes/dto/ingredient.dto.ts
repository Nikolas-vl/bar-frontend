export interface CreateIngredientDto {
  name: string;
  price: number;
}

export type UpdateIngredientDto = Partial<CreateIngredientDto>;
