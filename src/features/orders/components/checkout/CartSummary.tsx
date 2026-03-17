import type { Cart } from '@/types';
import { AppImage } from '@/components/shared/ui';
import { formatPrice } from '@/utils/cn';
import { calcCartSubtotal } from '../../../cart/utils/cartUtils';

interface CartSummaryProps {
  cart: Cart;
}

export function CartSummary({ cart }: CartSummaryProps) {
  const subtotal = calcCartSubtotal(cart);

  return (
    <div className='flex flex-col gap-3'>
      {cart.items.map(item => (
        <div key={item.id} className='flex items-center gap-3'>
          <div className='w-12 h-12 rounded-xl overflow-hidden shrink-0'>
            <AppImage src={item.dish.imageUrl} alt={item.dish.name} aspectRatio='square' />
          </div>
          <div className='flex-1 min-w-0'>
            <p className='text-sm font-medium text-ob-text truncate'>{item.dish.name}</p>
            {item.extras.length > 0 && <p className='text-[11px] text-ob-muted'>+ {item.extras.map(e => e.ingredient.name).join(', ')}</p>}
            {item.note && <p className='text-[11px] italic text-ob-muted'>"{item.note}"</p>}
          </div>
          <div className='text-right shrink-0'>
            <p className='text-xs text-ob-muted'>×{item.quantity}</p>
            <p className='text-sm font-semibold text-ob-caramel'>{formatPrice((parseFloat(item.dish.price) * item.quantity).toFixed(2))}</p>
          </div>
        </div>
      ))}

      {cart.ingredientItems.length > 0 && (
        <>
          <div className='divider' />
          {cart.ingredientItems.map(item => (
            <div key={item.id} className='flex items-center justify-between'>
              <p className='text-sm text-ob-text'>
                {item.ingredient.name} ×{item.quantity}
              </p>
              <p className='text-sm font-semibold text-ob-caramel'>{formatPrice((parseFloat(item.ingredient.price) * item.quantity).toFixed(2))}</p>
            </div>
          ))}
        </>
      )}

      <div className='divider' />
      <div className='flex justify-between text-sm'>
        <span className='text-ob-muted'>Subtotal</span>
        <span className='font-semibold text-ob-text'>{formatPrice(subtotal.toFixed(2))}</span>
      </div>
      <p className='text-[11px] text-ob-muted'>Final total with tax & fees calculated below</p>
    </div>
  );
}
