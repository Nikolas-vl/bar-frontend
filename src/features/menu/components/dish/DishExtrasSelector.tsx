import { formatPrice } from '@/utils/cn';
import type { DishIngredient } from '@/types';

interface DishExtrasSelectorProps {
  optionalIngredients: DishIngredient[];
  selected: Record<number, number>;
  onChange: (ingredientId: number, delta: number) => void;
}

export function DishExtrasSelector({ optionalIngredients, selected, onChange }: DishExtrasSelectorProps) {
  if (optionalIngredients.length === 0) return null;

  return (
    <div className='card p-5 mb-6'>
      <h2 className='font-display font-semibold text-sm uppercase tracking-wider mb-4 text-ob-muted'>Add Extras</h2>
      <div className='flex flex-col gap-3'>
        {optionalIngredients.map(di => {
          const qty = selected[di.ingredientId] ?? 0;
          return (
            <div key={di.ingredientId} className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-ob-text'>{di.ingredient.name}</p>
                <p className='text-xs text-ob-muted'>+{formatPrice(di.ingredient.price)} each</p>
              </div>
              <div className='qty-stepper'>
                <button
                  className='qty-btn'
                  onClick={() => onChange(di.ingredientId, -1)}
                  disabled={qty === 0}
                  aria-label={`Remove ${di.ingredient.name}`}
                >
                  -
                </button>
                <span className='qty-value'>{qty}</span>
                <button className='qty-btn' onClick={() => onChange(di.ingredientId, 1)} aria-label={`Add ${di.ingredient.name}`}>
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
