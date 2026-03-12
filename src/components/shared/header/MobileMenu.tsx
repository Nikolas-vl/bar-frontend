import { Link } from 'react-router-dom';
import { NavItem } from '../navigation/NavItem';
import { useAuthStore } from '../../../store/auth.store';
import { useUIStore } from '../../../store/ui.store';
import { IconCart } from '../../../assets/icons';

const mobileItemClass = 'px-3 py-2.5 text-sm rounded-xl font-medium transition-colors';
const mobileActiveClass = 'bg-[rgba(197,139,90,0.08)] text-[var(--color-ob-caramel)]';

interface MobileMenuProps {
  onClose: () => void;
  onLogout: () => void;
}

export function MobileMenu({ onClose, onLogout }: MobileMenuProps) {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const role = useAuthStore(s => s.user?.role);
  const toggleCart = useUIStore(s => s.toggleCart);

  return (
    <div
      className='md:hidden border-t animate-slide-down'
      style={{
        borderColor: 'var(--color-ob-border)',
        backgroundColor: 'var(--color-ob-surface)',
      }}
    >
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
              className={`flex items-center gap-2 w-full text-left ${mobileItemClass}`}
              style={{ color: 'var(--color-ob-muted)' }}
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
              className='text-left px-3 py-2.5 text-sm rounded-xl transition-colors'
              style={{ color: 'var(--color-ob-error)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(192,57,43,0.06)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
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
