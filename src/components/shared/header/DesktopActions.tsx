import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { IconCart, IconUser } from '../../../assets/icons';
import { useAuthStore } from '../../../store/auth.store';
import { authApi } from '../../../api/auth.api';
import { useUIStore } from '../../../store/ui.store';

export function DesktopActions() {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const user = useAuthStore(s => s.user);
  const clearAuth = useAuthStore(s => s.clearAuth);

  const toggleCart = useUIStore(s => s.toggleCart);

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } finally {
      clearAuth();
      navigate('/login');
      toast.success('See you soon ☕');
    }
  };

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

      <button onClick={handleLogout} className='btn-secondary text-sm'>
        Sign out
      </button>
    </div>
  );
}
