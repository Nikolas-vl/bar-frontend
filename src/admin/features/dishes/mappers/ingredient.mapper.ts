import type { Ingredient } from '@/shared/types/menu.types';
import type { CreateIngredientDto } from '../dto/ingredient.dto';
import type { IngredientFormInput, IngredientFormOutput } from '../schemas/ingredient.schema';

export const mapIngredientToForm = (ingredient: Ingredient): IngredientFormInput => ({
  name: ingredient.name,
  price: parseFloat(ingredient.price),
});

export const mapIngredientFormToDto = (formData: IngredientFormOutput): CreateIngredientDto => ({
  name: formData.name,
  price: formData.price,
});
