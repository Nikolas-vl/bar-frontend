import { Link } from 'react-router-dom';
import { IconCart, IconUser } from '@/assets/icons';
import { useAuthStore } from '@/store/auth.store';
import { useUIStore } from '@/store/ui.store';

interface DesktopActionsProps {
  onLogout: () => void; // defined once in Header, passed down
}

export function DesktopActions({ onLogout }: DesktopActionsProps) {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const user = useAuthStore(s => s.user);
  const toggleCart = useUIStore(s => s.toggleCart);

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
      <button onClick={toggleCart} className='btn-ghost flex items-center gap-1.5 text-sm'>
        <IconCart className='w-[18px] h-[18px]' />
        Cart
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
