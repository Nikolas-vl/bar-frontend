import { useCart } from '../hooks/useCart';
import { hasUnavailableItems, getUnavailableItems } from '../utils/cartUtils';
import { useUIStore } from '@/store/ui.store';

export const CartDrawer = () => {
  const { isCartOpen, closeCart } = useUIStore();
  const { data: cart } = useCart();

  const blocked = hasUnavailableItems(cart);
  const unavailableNames = getUnavailableItems(cart).map(i => i.dish.name);

  if (!isCartOpen) return null;

  return (
    <>
      <div className='backdrop' onClick={closeCart} />
      <div className='fixed top-0 right-0 h-full w-full max-w-sm z-50 flex flex-col animate-slide-in-right bg-ob-surface shadow-xl'>
        {/* Header */}
        <div className='flex items-center justify-between px-5 h-16 shrink-0 border-b border-ob-border'>
          <h2 className='font-display text-lg font-semibold'>Your Cart</h2>
          <button className='btn-icon-ghost' onClick={closeCart}>
            ✕
          </button>
        </div>

        {/* Items */}
        <div className='flex-1 overflow-y-auto px-5 py-4'>
          <p className='text-ob-muted'>Your cart is empty.</p>
        </div>

        {/* Unavailable warning banner */}
        {blocked && (
          <div className='mx-5 mb-3 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3'>
            <p className='text-xs font-semibold text-amber-700 mb-1'>⚠️ Order blocked</p>
            <p className='text-xs text-amber-600 leading-relaxed'>
              The following {unavailableNames.length === 1 ? 'dish is' : 'dishes are'} currently unavailable:{' '}
              <span className='font-medium'>{unavailableNames.join(', ')}</span>. Remove {unavailableNames.length === 1 ? 'it' : 'them'} to proceed.
            </p>
          </div>
        )}

        {/* Footer */}
        <div className='px-5 py-4 shrink-0 border-t border-ob-border'>
          <button
            className='btn-primary w-full justify-center'
            disabled={blocked}
            title={blocked ? 'Remove unavailable dishes to proceed' : undefined}
          >
            Proceed to checkout
          </button>
        </div>
      </div>
    </>
  );
};
