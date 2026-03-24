import { useIngredients } from '../hooks/useIngredients';
import { useAddIngredientToCart } from '../hooks/useAddIngredientToCart';
import { formatPrice } from '@/shared/lib/utils/cn';
import { Spinner } from '@/shared/ui';
import { useState } from 'react';

export function CartAddIngredients() {
  const { data: ingredients, isLoading } = useIngredients();
  const { mutate: add, isPending: isAdding } = useAddIngredientToCart();
  const [expanded, setExpanded] = useState(false);

  if (isLoading) return <div className="py-4 flex justify-center"><Spinner size="sm" /></div>;
  if (!ingredients || ingredients.length === 0) return null;

  return (
    <div className='mt-8 pt-6 border-t border-ob-border'>
      <div className='flex items-center justify-between mb-4'>
        <h3 className='font-display font-semibold text-sm text-ob-text'>Add more extras</h3>
        <button 
          onClick={() => setExpanded(!expanded)}
          className='text-xs text-ob-caramel font-medium hover:underline'
        >
          {expanded ? 'Show less' : 'View all'}
        </button>
      </div>

      <div className={`grid grid-cols-2 gap-3 transition-all duration-300 overflow-hidden ${expanded ? 'max-h-[500px]' : 'max-h-[140px]'}`}>
        {(expanded ? ingredients : ingredients.slice(0, 4)).map(ing => (
          <div 
            key={ing.id} 
            className='p-3 rounded-xl bg-ob-surface border border-ob-border flex flex-col justify-between gap-2 hover:border-ob-caramel transition-colors group'
          >
            <div>
              <p className='text-xs font-medium text-ob-text leading-tight'>{ing.name}</p>
              <p className='text-[10px] text-ob-muted mt-0.5'>{formatPrice(parseFloat(ing.price).toFixed(2))}</p>
            </div>
            <button
              onClick={() => add({ ingredientId: ing.id, quantity: 1 })}
              disabled={isAdding}
              className='btn-secondary py-1! px-2! text-[10px] w-full justify-center opacity-80 group-hover:opacity-100 group-hover:bg-ob-caramel group-hover:text-white group-hover:border-ob-caramel transition-all'
            >
              + Add
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
