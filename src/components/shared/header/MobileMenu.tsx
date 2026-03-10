import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { NavItem } from '../navigation/NavItem';
import { useAuthStore } from '../../../store/auth.store';
import { authApi } from '../../../api/auth.api';

interface MobileMenuProps {
  close: () => void;
}

export function MobileMenu({ close }: MobileMenuProps) {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const role = useAuthStore(s => s.user?.role);
  const clearAuth = useAuthStore(s => s.clearAuth);

  const navigate = useNavigate();

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      clearAuth();
      navigate('/login');
      toast.success('Logged out');
    }
  };

  return (
    <div className='md:hidden border-t bg-color-ob-surface'>
      <nav className='page-container py-4 flex flex-col gap-1'>
        <NavItem to='/menu' onClick={close} className='px-3 py-2.5 text-sm rounded-xl font-medium'>
          Menu
        </NavItem>

        {isAuthenticated && (
          <>
            <NavItem to='/orders' onClick={close} className='px-3 py-2.5 text-sm rounded-xl'>
              My Orders
            </NavItem>

            <NavItem to='/reservations' onClick={close} className='px-3 py-2.5 text-sm rounded-xl'>
              Reservations
            </NavItem>

            <NavItem to='/profile' onClick={close} className='px-3 py-2.5 text-sm rounded-xl'>
              Profile
            </NavItem>

            {role === 'ADMIN' && (
              <NavItem to='/admin' onClick={close} className='px-3 py-2.5 text-sm rounded-xl'>
                Admin Panel
              </NavItem>
            )}

            <button
              onClick={() => {
                logout();
                close();
              }}
              className='text-left px-3 py-2.5 text-sm'
            >
              Sign out
            </button>
          </>
        )}

        {!isAuthenticated && (
          <>
            <NavItem to='/login' onClick={close} className='px-3 py-2.5 text-sm rounded-xl'>
              Sign in
            </NavItem>

            <div className='px-3 pt-2'>
              <Link to='/register' onClick={close} className='btn-primary w-full justify-center'>
                Reserve a table
              </Link>
            </div>
          </>
        )}
      </nav>
    </div>
  );
}
