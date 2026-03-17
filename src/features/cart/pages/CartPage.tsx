import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useClearCart } from '../hooks/useClearCart';
import { calcCartSubtotal, hasUnavailableItems, getUnavailableItems } from '../utils/cartUtils';
import { CartItemRow } from '../components/CartItemRow';
import { CartIngredientItemRow } from '../components/CartIngredientItemRow';
import { Spinner } from '@/components/shared/ui';
import { formatPrice, cn } from '@/utils/cn';

export default function CartPage() {
  const { data: cart, isLoading } = useCart();
  const { mutate: clearCart, isPending: isClearing } = useClearCart();

  const isEmpty = !cart || (cart.items.length === 0 && cart.ingredientItems.length === 0);
  const subtotal = calcCartSubtotal(cart);
  const blocked = hasUnavailableItems(cart);
  const unavailableNames = getUnavailableItems(cart).map(i => i.dish.name);

  if (isLoading) {
    return (
      <div className='page-container py-16 flex justify-center'>
        <Spinner variant='caramel' size='md' />
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className='page-container py-16 text-center'>
        <span className='text-6xl block mb-4 select-none'>🛒</span>
        <h1 className='font-display text-2xl font-semibold mb-2 text-ob-text'>Your cart is empty</h1>
        <p className='text-ob-muted mb-6 text-sm'>Browse our menu and add something delicious.</p>
        <Link to='/menu' className='btn-primary'>
          Explore Menu
        </Link>
      </div>
    );
  }

  return (
    <div className='page-container py-10'>
      {/* Header */}
      <div className='flex items-center justify-between mb-8'>
        <h1 className='font-display text-3xl font-semibold text-ob-text'>Your Cart</h1>
        <button
          onClick={() => clearCart()}
          disabled={isClearing}
          className='text-sm text-ob-muted hover:text-ob-error transition-colors underline underline-offset-2'
        >
          {isClearing ? 'Clearing…' : 'Clear all'}
        </button>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-5 gap-8'>
        {/* ── Left: item list ── */}
        <div className='lg:col-span-3'>
          {/* Unavailable banner */}
          {blocked && (
            <div className='mb-4 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3'>
              <p className='text-xs font-semibold text-amber-700 mb-0.5'>⚠️ Order blocked</p>
              <p className='text-xs text-amber-600 leading-relaxed'>
                {unavailableNames.length === 1 ? 'This dish is' : 'These dishes are'} currently unavailable:{' '}
                <span className='font-medium'>{unavailableNames.join(', ')}</span>. Remove {unavailableNames.length === 1 ? 'it' : 'them'} to
                continue.
              </p>
            </div>
          )}

          {/* Dish items */}
          <div className='card'>
            {cart!.items.map(item => (
              <div key={item.id} className='px-4'>
                <CartItemRow item={item} />
              </div>
            ))}
          </div>

          {/* Standalone ingredient items */}
          {cart!.ingredientItems.length > 0 && (
            <div className='card mt-4'>
              <div className='px-4 pt-4 pb-2'>
                <h2 className='font-display font-semibold text-sm uppercase tracking-wider text-ob-muted mb-3'>Extra Ingredients</h2>
                {cart!.ingredientItems.map(item => (
                  <CartIngredientItemRow key={item.id} item={item} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Right: summary ── */}
        <div className='lg:col-span-2'>
          <div className='card p-5 sticky top-24 flex flex-col gap-4'>
            <h2 className='font-display font-semibold text-sm uppercase tracking-wider text-ob-muted'>Summary</h2>

            <div className='flex justify-between items-center text-sm'>
              <span className='text-ob-muted'>Subtotal ({cart!.items.reduce((s, i) => s + i.quantity, 0)} items)</span>
              <span className='font-semibold text-ob-text'>{formatPrice(subtotal.toFixed(2))}</span>
            </div>
            <p className='text-[11px] text-ob-muted -mt-2'>Tax &amp; delivery fees calculated at checkout</p>

            <Link
              to='/checkout'
              aria-disabled={blocked}
              className={cn('btn-primary w-full justify-center', blocked && 'opacity-50 pointer-events-none')}
            >
              Proceed to Checkout →
            </Link>

            <Link to='/menu' className='text-center text-sm text-ob-muted hover:text-ob-text transition-colors underline underline-offset-2'>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
