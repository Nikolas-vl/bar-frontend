import { IngredientChip } from '../IngredientChip';
import type { DishIngredient } from '@/shared/types';

interface DishIngredientsProps {
  ingredients: DishIngredient[];
}

export function DishIngredients({ ingredients }: DishIngredientsProps) {
  if (ingredients.length === 0) return null;

  const required = ingredients.filter(i => !i.optional);
  const optional = ingredients.filter(i => i.optional);

  return (
    <div className='card p-5 mb-8'>
      <h2 className='font-display font-semibold text-sm uppercase tracking-wider mb-4 text-ob-muted'>Ingredients</h2>

      {required.length > 0 && (
        <div className='mb-3'>
          <p className='text-xs font-semibold uppercase tracking-wider mb-2 text-ob-muted'>Included</p>
          <div className='flex flex-wrap gap-2'>
            {required.map(di => (
              <IngredientChip key={di.ingredientId} name={di.ingredient.name} quantity={di.quantity} optional={false} />
            ))}
          </div>
        </div>
      )}

      {optional.length > 0 && (
        <div>
          <p className='text-xs font-semibold uppercase tracking-wider mb-2 text-ob-muted'>Optional extras</p>
          <div className='flex flex-wrap gap-2'>
            {optional.map(di => (
              <IngredientChip key={di.ingredientId} name={di.ingredient.name} quantity={di.quantity} price={di.ingredient.price} optional />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
