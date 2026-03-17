import { Link } from 'react-router-dom';
import { IconCart, IconUser } from '@/assets/icons';
import { useAuthStore } from '@/store/auth.store';
import { useUIStore } from '@/store/ui.store';
import { useCart } from '@/features/cart/hooks/useCart';
import { getTotalItemCount } from '@/features/cart/utils/cartUtils';

interface DesktopActionsProps {
  onLogout: () => void; // defined once in Header, passed down
}

export function DesktopActions({ onLogout }: DesktopActionsProps) {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const user = useAuthStore(s => s.user);
  const toggleCart = useUIStore(s => s.toggleCart);
  const { data: cart } = useCart();
  const cartCount = getTotalItemCount(cart);

  if (!isAuthenticated) {
    return (
      <div className='hidden md:flex items-center gap-2'>
        <Link to='/login' className='btn-ghost text-sm'>
          Sign in
        </Link>
        <Link to='/register' className='btn-primary text-sm'>
          Reserve a table
        </Link>
      </div>
    );
  }

  return (
    <div className='hidden md:flex items-center gap-2'>
      <button onClick={toggleCart} className='btn-ghost flex items-center gap-1.5 text-sm relative'>
        <IconCart className='w-[18px] h-[18px]' />
        Cart
        {cartCount > 0 && (
          <span className='absolute -top-1 -right-1.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full text-[10px] font-bold leading-none px-1 bg-ob-caramel text-white'>
            {cartCount > 99 ? '99+' : cartCount}
          </span>
        )}
      </button>

      <Link to='/profile' className='btn-ghost flex items-center gap-1.5 text-sm'>
        <IconUser className='w-[18px] h-[18px]' />
        {user?.name ?? 'Profile'}
      </Link>

      <button onClick={onLogout} className='btn-secondary text-sm'>
        Sign out
      </button>
    </div>
  );
}
