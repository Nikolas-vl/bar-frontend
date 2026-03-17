import { useUIStore } from '../../../store/ui.store';

export const CartDrawer = () => {
  const { isCartOpen, closeCart } = useUIStore();

  if (!isCartOpen) return null;

  return (
    <>
      <div className='backdrop' onClick={closeCart} />
      <div className='fixed top-0 right-0 h-full w-full max-w-sm z-50 flex flex-col animate-slide-in-right bg-ob-surface shadow-xl'>
        <div className='flex items-center justify-between px-5 h-16 shrink-0 border-b border-ob-border'>
          <h2 className='font-display text-lg font-semibold'>Your Cart</h2>
          <button className='btn-icon-ghost' onClick={closeCart}>
            ✕
          </button>
        </div>

        <div className='flex-1 overflow-y-auto px-5 py-4'>
          <p className='text-ob-muted'>Your cart is empty.</p>
        </div>
        <div className='px-5 py-4 shrink-0 border-t border-ob-border'>
          <button className='btn-primary w-full justify-center' disabled>
            Proceed to checkout
          </button>
        </div>
      </div>
    </>
  );
};
