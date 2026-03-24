import { memo } from 'react';
import type { CartIngredientItem } from '@/shared/types';
import { cn, formatPrice } from '@/shared/lib/utils/cn';
import { useUpdateCartIngredientItem } from '../hooks/useUpdateCartIngredientItem';
import { useRemoveIngredientFromCart } from '../hooks/useRemoveIngredientFromCart';
import { QuantityStepper } from './QuantityStepper';
import { NoteEditor } from './NoteEditor';
import { IconTrash } from '@/shared/assets/icons';

interface CartIngredientItemRowProps {
  item: CartIngredientItem;
}

export const CartIngredientItemRow = memo(function CartIngredientItemRow({ item }: CartIngredientItemRowProps) {
  const { mutate: update, isPending: isUpdating } = useUpdateCartIngredientItem();
  const { mutate: remove, isPending: isRemoving } = useRemoveIngredientFromCart();

  const isPending = isUpdating || isRemoving;

  return (
    <div className={cn('flex gap-3 py-4 border-b border-ob-border last:border-0 transition-opacity', isPending && 'opacity-50 pointer-events-none')}>
      {/* Content */}
      <div className='flex-1 min-w-0'>
        {/* Name row */}
        <div className='flex items-start justify-between gap-2'>
          <p className='font-medium text-sm leading-tight truncate text-ob-text'>{item.ingredient.name}</p>

          <button
            onClick={() => remove(item.id)}
            className='shrink-0 text-ob-border hover:text-ob-error transition-colors'
            aria-label='Remove ingredient'
          >
            <IconTrash className='w-3.5 h-3.5' />
          </button>
        </div>

        {/* Note */}
        <div className='mt-1'>
          <NoteEditor
            note={item.note}
            onSave={note =>
              update({
                cartIngredientItemId: item.id,
                quantity: item.quantity,
                note,
              })
            }
          />
        </div>

        {/* Price + Stepper */}
        <div className='flex items-center justify-between mt-2'>
          <span className='font-display font-semibold text-sm text-ob-caramel'>
            {formatPrice((parseFloat(String(item.ingredient.price)) * item.quantity).toFixed(2))}
          </span>

          <QuantityStepper
            quantity={item.quantity}
            onDecrement={() => {
              if (item.quantity === 1) remove(item.id);
              else update({ cartIngredientItemId: item.id, quantity: item.quantity - 1 });
            }}
            onIncrement={() => update({ cartIngredientItemId: item.id, quantity: item.quantity + 1 })}
          />
        </div>
      </div>
    </div>
  );
});
