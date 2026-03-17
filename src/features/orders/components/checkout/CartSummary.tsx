import type { Cart } from '@/types';
import { AppImage } from '@/components/shared/ui';
import { formatPrice } from '@/utils/cn';
import { calcItemTotal } from '../../../cart/utils/cartUtils';

interface CartSummaryProps {
  cart: Cart;
}

export function CartSummary({ cart }: CartSummaryProps) {
  return (
    <div className='flex flex-col gap-3'>
      {/* ── Dish items ── */}
      {cart.items.map(item => {
        const itemTotal = calcItemTotal(item);
        const extrasTotal = item.extras.reduce((sum, e) => sum + parseFloat(String(e.ingredient.price)) * e.quantity, 0);

        return (
          <div key={item.id} className='flex items-start gap-3'>
            {/* Thumbnail */}
            <div className='w-14 h-14 rounded-xl overflow-hidden shrink-0'>
              <AppImage src={item.dish.imageUrl} alt={item.dish.name} aspectRatio='square' />
            </div>

            {/* Details */}
            <div className='flex-1 min-w-0'>
              <p className='text-sm font-medium text-ob-text truncate'>{item.dish.name}</p>

              {item.extras.length > 0 && (
                <p className='text-[11px] text-ob-muted leading-relaxed'>
                  + {item.extras.map(e => e.ingredient.name).join(', ')}
                  {extrasTotal > 0 && <span className='ml-1 text-ob-caramel'>(+{formatPrice(extrasTotal.toFixed(2))})</span>}
                </p>
              )}

              {item.note && <p className='text-[11px] italic text-ob-muted mt-0.5'>"{item.note}"</p>}
            </div>

            {/* Price */}
            <div className='text-right shrink-0'>
              <p className='text-xs text-ob-muted'>×{item.quantity}</p>
              {/* ✅ Use calcItemTotal — includes extras × quantity */}
              <p className='text-sm font-semibold text-ob-caramel'>{formatPrice(itemTotal.toFixed(2))}</p>
            </div>
          </div>
        );
      })}

      {/* ── Standalone ingredient items ── */}
      {cart.ingredientItems.length > 0 && (
        <>
          <div className='divider' />
          {cart.ingredientItems.map(item => (
            <div key={item.id} className='flex items-center justify-between'>
              <p className='text-sm text-ob-text'>
                {item.ingredient.name} <span className='text-ob-muted text-xs'>×{item.quantity}</span>
              </p>
              <p className='text-sm font-semibold text-ob-caramel'>
                {formatPrice((parseFloat(String(item.ingredient.price)) * item.quantity).toFixed(2))}
              </p>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
