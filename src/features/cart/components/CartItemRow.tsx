import { memo } from 'react';
import type { CartItem } from '../../../types';
import { AppImage } from '../../../components/shared/ui/AppImage';
import { cn, formatPrice } from '../../../utils/cn';
import { calcItemTotal } from '../utils/cartUtils';
import { useUpdateCartItem } from '../hooks/useUpdateCartItem';
import { useRemoveFromCart } from '../hooks/useRemoveFromCart';
import { IconTrash } from '../../../assets/icons';

interface CartItemRowProps {
  item: CartItem;
}

export const CartItemRow = memo(function CartItemRow({ item }: CartItemRowProps) {
  const { mutate: update, isPending: isUpdating } = useUpdateCartItem();
  const { mutate: remove, isPending: isRemoving } = useRemoveFromCart();

  const isPending = isUpdating || isRemoving;

  const handleDecrement = () => {
    if (item.quantity === 1) {
      remove(item.id);
    } else {
      update({ cartItemId: item.id, quantity: item.quantity - 1 });
    }
  };

  const handleIncrement = () => {
    update({ cartItemId: item.id, quantity: item.quantity + 1 });
  };

  return (
    <div className={cn('flex gap-3 py-4 border-b border-ob-border last:border-0 transition-opacity', isPending && 'opacity-50 pointer-events-none')}>
      {/* Thumbnail */}
      <div className='shrink-0 w-16 h-16 rounded-xl overflow-hidden'>
        <AppImage src={item.dish.imageUrl} alt={item.dish.name} aspectRatio='square' fallbackIcon='🍽️' />
      </div>

      {/* Content */}
      <div className='flex-1 min-w-0'>
        <div className='flex items-start justify-between gap-2'>
          <div className='min-w-0'>
            <p className='font-medium text-sm leading-tight truncate text-ob-text'>{item.dish.name}</p>
            {!item.dish.isAvailable && (
              <span className='inline-block mt-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-600'>Unavailable</span>
            )}
          </div>

          {/* Remove */}
          <button onClick={() => remove(item.id)} className='shrink-0 text-ob-border hover:text-ob-error transition-colors' aria-label='Remove item'>
            <IconTrash className='w-3.5 h-3.5' />
          </button>
        </div>

        {/* Extras */}
        {item.extras.length > 0 && (
          <p className='text-[11px] mt-0.5 leading-relaxed text-ob-muted'>
            + {item.extras.map(e => `${e.ingredient.name}${e.quantity > 1 ? ` ×${e.quantity}` : ''}`).join(', ')}
          </p>
        )}

        {/* Note */}
        {item.note && <p className='text-[11px] italic mt-0.5 truncate text-ob-muted'>"{item.note}"</p>}

        {/* Price + Stepper */}
        <div className='flex items-center justify-between mt-2'>
          <span className='font-display font-semibold text-sm text-ob-caramel'>{formatPrice(calcItemTotal(item).toFixed(2))}</span>

          <div className='qty-stepper'>
            <button className='qty-btn' onClick={handleDecrement} aria-label='Decrease quantity'>
              -
            </button>
            <span className='qty-value'>{item.quantity}</span>
            <button className='qty-btn' onClick={handleIncrement} aria-label='Increase quantity'>
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});
