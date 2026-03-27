import { useState } from 'react';
import { Select } from '@/shared/ui/Select';
import { Spinner } from '@/shared/ui/Spinner';
import { IconPlus, IconClose } from '@/shared/assets/icons';
import { useAddIngredientToDish, useRemoveIngredientFromDish } from '../hooks/useAdminDishes';
import { useAdminIngredients } from '../hooks/useAdminIngredients';
import { formatPrice, cn } from '@/shared/lib/utils/cn';
import type { DishIngredient } from '@/shared/types';

interface DishIngredientEditorProps {
  dishId: number;
  ingredients: DishIngredient[];
}

export function DishIngredientEditor({ dishId, ingredients }: DishIngredientEditorProps) {
  const { data: allIngredients } = useAdminIngredients();
  const addMutation = useAddIngredientToDish();
  const removeMutation = useRemoveIngredientFromDish();

  const [isAdding, setIsAdding] = useState(false);
  const [selectedIngredientId, setSelectedIngredientId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [optional, setOptional] = useState(false);
  const [ingSearch, setIngSearch] = useState('');

  // Filter out already-used ingredients
  const usedIds = new Set(ingredients.map(i => i.ingredientId));
  const availableIngredients = (allIngredients ?? []).filter(i => !usedIds.has(i.id));

  const filtered = availableIngredients.filter(i => i.name.toLowerCase().includes(ingSearch.toLowerCase()));
  const ingredientOptions = filtered.map(i => ({
    value: String(i.id),
    label: `${i.name} (${formatPrice(i.price)})`,
  }));

  const handleAdd = () => {
    if (!selectedIngredientId) return;
    addMutation.mutate(
      { dishId, body: { ingredientId: Number(selectedIngredientId), quantity, optional } },
      {
        onSuccess: () => {
          setIsAdding(false);
          setSelectedIngredientId('');
          setQuantity(1);
          setOptional(false);
          setIngSearch('');
        },
      },
    );
  };

  return (
    <div className='space-y-3'>
      <div className='flex items-center justify-between'>
        <span className='text-xs font-semibold uppercase tracking-wider text-ob-muted'>Ingredients</span>
        {!isAdding && (
          <button type='button' className='btn-ghost text-xs inline-flex items-center gap-1' onClick={() => setIsAdding(true)}>
            <IconPlus className='w-3 h-3' /> Add
          </button>
        )}
      </div>

      {/* Current ingredients */}
      <div className='flex flex-wrap gap-2'>
        {ingredients.length === 0 && <span className='text-xs text-ob-muted italic'>No ingredients linked</span>}
        {ingredients.map(di => (
          <span
            key={di.ingredientId}
            className={cn(
              'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs',
              di.optional ? 'border border-dashed border-ob-border text-ob-muted' : 'bg-ob-blue text-ob-text',
            )}
          >
            {di.ingredient.name} ×{di.quantity}
            {di.optional && <span className='text-[10px]'>({formatPrice(di.ingredient.price)})</span>}
            <button
              type='button'
              onClick={() => removeMutation.mutate({ dishId, ingredientId: di.ingredientId })}
              className='hover:text-ob-error transition-colors'
              aria-label={`Remove ${di.ingredient.name}`}
              disabled={removeMutation.isPending}
            >
              <IconClose className='w-3 h-3' />
            </button>
          </span>
        ))}
      </div>

      {/* Add ingredient form */}
      {isAdding && (
        <div className='card p-3 space-y-3'>
          <input
            type='text'
            placeholder='Search ingredients…'
            value={ingSearch}
            onChange={e => setIngSearch(e.target.value)}
            className='input text-sm'
          />
          <Select
            value={selectedIngredientId}
            onChange={setSelectedIngredientId}
            options={ingredientOptions}
            placeholder={filtered.length === 0 ? 'No matches' : 'Select ingredient'}
          />
          <div className='flex items-center gap-3'>
            <input
              type='number'
              min='1'
              value={quantity}
              onChange={e => setQuantity(Number(e.target.value))}
              className='input w-20'
              aria-label='Quantity'
            />
            <label className='flex items-center gap-1.5 cursor-pointer text-xs'>
              <input type='checkbox' checked={optional} onChange={e => setOptional(e.target.checked)} className='accent-ob-caramel w-3.5 h-3.5' />
              Optional
            </label>
          </div>
          <div className='flex gap-2'>
            <button
              type='button'
              className='btn-ghost text-xs'
              onClick={() => {
                setIsAdding(false);
                setIngSearch('');
              }}
            >
              Cancel
            </button>
            <button
              type='button'
              className='btn-primary text-xs inline-flex items-center gap-1.5'
              onClick={handleAdd}
              disabled={!selectedIngredientId || addMutation.isPending}
            >
              {addMutation.isPending && <Spinner variant='white' size='sm' />}
              Add
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
