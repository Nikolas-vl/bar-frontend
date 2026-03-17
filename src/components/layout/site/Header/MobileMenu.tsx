import { Link } from 'react-router-dom';
import { NavItem } from '../../../shared/navigation/NavItem';
import { useAuthStore } from '../../../../store/auth.store';
import { useUIStore } from '../../../../store/ui.store';
import { IconCart } from '../../../../assets/icons';

const mobileItemClass = 'px-3 py-2.5 text-sm rounded-xl font-medium transition-colors';
const mobileActiveClass = 'bg-ob-caramel/10 text-ob-caramel';

interface MobileMenuProps {
  onClose: () => void;
  onLogout: () => void;
}

export function MobileMenu({ onClose, onLogout }: MobileMenuProps) {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const role = useAuthStore(s => s.user?.role);
  const toggleCart = useUIStore(s => s.toggleCart);

  return (
    <div className='md:hidden border-t border-ob-border bg-ob-surface animate-slide-down'>
      <nav className='page-container py-4 flex flex-col gap-1'>
        <NavItem to='/menu' onClick={onClose} className={mobileItemClass} activeClassName={mobileActiveClass}>
          Menu
        </NavItem>

        {isAuthenticated && (
          <>
            <NavItem to='/orders' onClick={onClose} className={mobileItemClass} activeClassName={mobileActiveClass}>
              My Orders
            </NavItem>

            <NavItem to='/reservations' onClick={onClose} className={mobileItemClass} activeClassName={mobileActiveClass}>
              Reservations
            </NavItem>

            <NavItem to='/profile' onClick={onClose} className={mobileItemClass} activeClassName={mobileActiveClass}>
              Profile
            </NavItem>

            {role === 'ADMIN' && (
              <NavItem to='/admin' onClick={onClose} className={mobileItemClass} activeClassName={mobileActiveClass}>
                Admin Panel
              </NavItem>
            )}

            <button
              onClick={() => {
                toggleCart();
                onClose();
              }}
              className={`flex items-center gap-2 w-full text-left text-ob-muted ${mobileItemClass}`}
            >
              <IconCart className='w-4 h-4' />
              Cart
            </button>

            <div className='divider my-1' />

            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className='text-left px-3 py-2.5 text-sm rounded-xl transition-colors text-ob-error hover:bg-ob-error/6'
            >
              Sign out
            </button>
          </>
        )}

        {!isAuthenticated && (
          <>
            <NavItem to='/login' onClick={onClose} className={mobileItemClass} activeClassName={mobileActiveClass}>
              Sign in
            </NavItem>

            <div className='px-3 pt-2'>
              <Link to='/register' onClick={onClose} className='btn-primary w-full justify-center'>
                Reserve a table
              </Link>
            </div>
          </>
        )}
      </nav>
    </div>
  );
}
