import { NutritionStat } from '../NutritionStat';
import type { Dish } from '@/shared/types';

interface DishNutritionProps {
  dish: Dish;
}

export function DishNutrition({ dish }: DishNutritionProps) {
  if (dish.calories === null) return null;

  return (
    <div className='card p-5 mb-6'>
      <h2 className='font-display font-semibold text-sm uppercase tracking-wider mb-4 text-ob-muted'>Nutritional Values</h2>
      <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
        <NutritionStat label='Calories' value={dish.calories} unit='kcal' highlight />
        {dish.protein !== null && <NutritionStat label='Protein' value={dish.protein} unit='g' />}
        {dish.fat !== null && <NutritionStat label='Fat' value={dish.fat} unit='g' />}
        {dish.carbs !== null && <NutritionStat label='Carbs' value={dish.carbs} unit='g' />}
      </div>
    </div>
  );
}
