import { Link } from 'react-router-dom';
import { useUIStore } from '../../../store/ui.store';
import { useCart } from '../hooks/useCart';
import { useClearCart } from '../hooks/useClearCart';
import { hasUnavailableItems, getUnavailableItems, calcCartSubtotal, getTotalItemCount } from '../utils/cartUtils';
import { CartItemRow } from './CartItemRow';
import { formatPrice, cn } from '../../../utils/cn';
import { Spinner } from '../../../components/shared/ui/Spinner';

export const CartDrawer = () => {
  const { isCartOpen, closeCart } = useUIStore();
  const { data: cart, isLoading } = useCart();
  const { mutate: clearCart, isPending: isClearing } = useClearCart();

  const blocked = hasUnavailableItems(cart);
  const unavailableNames = getUnavailableItems(cart).map(i => i.dish.name);
  const subtotal = calcCartSubtotal(cart);
  const itemCount = getTotalItemCount(cart);
  const isEmpty = !cart || cart.items.length === 0;

  if (!isCartOpen) return null;

  return (
    <>
      <div className='backdrop' onClick={closeCart} />

      <div className='fixed top-0 right-0 h-full w-full max-w-sm z-50 flex flex-col animate-slide-in-right bg-ob-surface shadow-xl'>
        {/* ── Header ──────────────────────────────── */}
        <div className='flex items-center justify-between px-5 h-16 shrink-0 border-b border-ob-border'>
          <div>
            <h2 className='font-display text-lg font-semibold text-ob-text'>Your Cart</h2>
            {itemCount > 0 && (
              <p className='text-xs text-ob-muted leading-none mt-0.5'>
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </p>
            )}
          </div>

          <div className='flex items-center gap-3'>
            {!isEmpty && (
              <button
                onClick={() => clearCart()}
                disabled={isClearing}
                className='text-xs text-ob-muted hover:text-ob-error transition-colors underline underline-offset-2'
              >
                {isClearing ? 'Clearing…' : 'Clear all'}
              </button>
            )}
            <button className='btn-icon-ghost' onClick={closeCart} aria-label='Close cart'>
              ✕
            </button>
          </div>
        </div>

        {/* ── Items ───────────────────────────────── */}
        <div className='flex-1 overflow-y-auto px-5'>
          {isLoading && (
            <div className='flex items-center justify-center py-16'>
              <Spinner variant='caramel' size='md' />
            </div>
          )}

          {!isLoading && isEmpty && (
            <div className='flex flex-col items-center justify-center py-16 gap-3 text-center'>
              <span className='text-5xl select-none'>🛒</span>
              <p className='font-display font-semibold text-ob-text'>Your cart is empty</p>
              <p className='text-sm text-ob-muted max-w-[200px]'>Browse our menu and add something delicious</p>
              <Link to='/menu' onClick={closeCart} className='btn-secondary text-sm mt-2'>
                Explore Menu
              </Link>
            </div>
          )}

          {!isLoading && !isEmpty && (
            <div>
              {cart.items.map(item => (
                <CartItemRow key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* ── Unavailable warning ─────────────────── */}
        {blocked && (
          <div className='mx-5 mb-3 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3'>
            <p className='text-xs font-semibold text-amber-700 mb-1'>⚠️ Order blocked</p>
            <p className='text-xs text-amber-600 leading-relaxed'>
              {unavailableNames.length === 1 ? 'This dish is' : 'These dishes are'} currently unavailable:{' '}
              <span className='font-medium'>{unavailableNames.join(', ')}</span>. Remove {unavailableNames.length === 1 ? 'it' : 'them'} to proceed.
            </p>
          </div>
        )}

        {/* ── Footer ──────────────────────────────── */}
        {!isEmpty && (
          <div className='px-5 py-4 shrink-0 border-t border-ob-border space-y-3'>
            <div className='flex items-center justify-between'>
              <span className='text-sm text-ob-muted'>Subtotal</span>
              <span className='font-display font-semibold text-ob-text'>{formatPrice(subtotal.toFixed(2))}</span>
            </div>
            <p className='text-[11px] text-ob-muted'>Tax &amp; delivery fees calculated at checkout</p>
            <Link
              to='/checkout'
              onClick={closeCart}
              className={cn('btn-primary w-full justify-center', blocked && 'opacity-50 pointer-events-none')}
              aria-disabled={blocked}
            >
              Proceed to Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  );
};
