import { AppImage } from '@/components/shared/ui';
import { formatPrice, cn } from '@/utils/cn';
import { IconEdit, IconTrash } from '@/assets/icons';
import { DishIngredientEditor } from './DishIngredientEditor';
import type { Dish } from '@/types';

interface DishAdminCardProps {
  dish: Dish;
  onEdit: () => void;
  onDelete: () => void;
  onToggleAvailability: (isAvailable: boolean) => void;
}

export function DishAdminCard({ dish, onEdit, onDelete, onToggleAvailability }: DishAdminCardProps) {
  return (
    <div className='card overflow-hidden group'>
      <AppImage src={dish.imageUrl} alt={dish.name} aspectRatio='4/3' className='rounded-b-none' hoverScale />

      <div className='p-4 space-y-3'>
        <div className='flex items-start justify-between'>
          <div>
            <h3 className='font-display font-semibold text-ob-text text-sm leading-tight'>{dish.name}</h3>
            <span className='badge mt-1 text-[10px]'>{dish.category}</span>
          </div>
          <span className='text-sm font-display font-semibold text-ob-caramel'>{formatPrice(dish.price)}</span>
        </div>

        {dish.calories && <p className='text-xs text-ob-muted'>{dish.calories} kcal</p>}

        {/* Availability toggle */}
        <label className='flex items-center gap-2 cursor-pointer'>
          <div className='relative'>
            <input type='checkbox' checked={dish.isAvailable} onChange={e => onToggleAvailability(e.target.checked)} className='sr-only peer' />
            <div className={cn('w-9 h-5 rounded-full transition-colors', dish.isAvailable ? 'bg-ob-success' : 'bg-ob-border')} />
            <div
              className={cn(
                'absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform',
                dish.isAvailable && 'translate-x-4',
              )}
            />
          </div>
          <span className='text-xs text-ob-muted'>{dish.isAvailable ? 'Available' : 'Unavailable'}</span>
        </label>

        {/* Ingredients */}
        <DishIngredientEditor dishId={dish.id} ingredients={dish.ingredients} />

        {/* Actions */}
        <div className='flex gap-2 pt-2 border-t border-ob-border'>
          <button type='button' onClick={onEdit} className='btn-ghost text-xs flex-1 inline-flex items-center justify-center gap-1'>
            <IconEdit className='w-3.5 h-3.5' /> Edit
          </button>
          <button type='button' onClick={onDelete} className='btn-ghost text-xs text-ob-error flex-1 inline-flex items-center justify-center gap-1'>
            <IconTrash className='w-3.5 h-3.5' /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}
