import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { cn } from '../../utils/cn';
import { useAuthStore } from '../../store/auth.store';
import { useUIStore } from '../../store/ui.store';
import { authApi } from '../../api/auth.api';
import { toast } from 'sonner';
import { Logo } from '../ui/Logo';
import { IconCart, IconUser, IconMenu, IconClose } from '../../assets/icons';

/* ── Sub-components ──────────────────────────────────────── */

const NavItem = ({ to, children }: { to: string; children: React.ReactNode }) => (
  <NavLink to={to} className={({ isActive }) => cn('nav-link', isActive && 'nav-link-active')}>
    {children}
  </NavLink>
);

const MobileNavItem = ({ to, children, onClick }: { to: string; children: React.ReactNode; onClick?: () => void }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      cn(
        'px-3 py-2.5 text-sm rounded-xl transition-colors font-medium',
        isActive
          ? 'bg-[rgba(197,139,90,0.08)] text-[var(--color-ob-caramel)]'
          : 'text-[var(--color-ob-muted)] hover:bg-[var(--color-ob-border)] hover:text-[var(--color-ob-text)]',
      )
    }
  >
    {children}
  </NavLink>
);

/* ── Header ──────────────────────────────────────────────── */

export const Header = () => {
  const { isAuthenticated, user, clearAuth } = useAuthStore();
  const { toggleCart } = useUIStore();
  const navigate = useNavigate();
  const [isMobileOpen, setMobileOpen] = useState(false);

  const closeMobile = () => setMobileOpen(false);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } finally {
      clearAuth();
      navigate('/login');
      toast.success('See you soon! ☕');
    }
  };

  return (
    <header
      className='sticky top-0 z-40'
      style={{
        backgroundColor: 'var(--color-ob-bg)',
        borderBottom: '1px solid var(--color-ob-border)',
        boxShadow: '0 1px 8px rgba(47,47,47,0.05)',
      }}
    >
      <div className='page-container'>
        <div className='flex items-center justify-between h-16'>
          {/* ── Logo ──────────────────────────────── */}
          <Link to='/'>
            <Logo size='sm' />
          </Link>

          {/* ── Desktop nav ───────────────────────── */}
          <nav className='hidden md:flex items-center gap-7'>
            <NavItem to='/menu'>Menu</NavItem>

            {isAuthenticated && (
              <>
                <NavItem to='/orders'>My Orders</NavItem>
                <NavItem to='/reservations'>Reservations</NavItem>
              </>
            )}

            {user?.role === 'ADMIN' && (
              <NavItem to='/admin'>
                <span
                  className='px-2.5 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider'
                  style={{ background: 'rgba(197,139,90,0.10)', color: 'var(--color-ob-caramel)' }}
                >
                  Admin
                </span>
              </NavItem>
            )}
          </nav>

          {/* ── Desktop actions ───────────────────── */}
          <div className='hidden md:flex items-center gap-2'>
            {isAuthenticated ? (
              <>
                <button onClick={toggleCart} className='btn-ghost flex items-center gap-1.5 text-sm'>
                  <IconCart className='w-[18px] h-[18px]' />
                  <span>Cart</span>
                </button>

                <Link to='/profile' className='btn-ghost flex items-center gap-1.5 text-sm'>
                  <IconUser className='w-[18px] h-[18px]' />
                  <span>{user?.name ?? 'Profile'}</span>
                </Link>

                <button onClick={handleLogout} className='btn-secondary text-sm'>
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link to='/login' className='btn-ghost text-sm'>
                  Sign in
                </Link>
                <Link to='/register' className='btn-primary text-sm'>
                  Reserve a table
                </Link>
              </>
            )}
          </div>

          {/* ── Mobile toggle ─────────────────────── */}
          <button className='md:hidden btn-icon-ghost' onClick={() => setMobileOpen(v => !v)} aria-label='Toggle menu'>
            {isMobileOpen ? <IconClose className='w-5 h-5' /> : <IconMenu className='w-5 h-5' />}
          </button>
        </div>
      </div>

      {/* ── Mobile menu ───────────────────────────── */}
      {isMobileOpen && (
        <div
          className='md:hidden border-t animate-slide-down'
          style={{
            borderColor: 'var(--color-ob-border)',
            backgroundColor: 'var(--color-ob-surface)',
          }}
        >
          <nav className='page-container py-4 flex flex-col gap-1'>
            <MobileNavItem to='/menu' onClick={closeMobile}>
              Menu
            </MobileNavItem>

            {isAuthenticated && (
              <>
                <MobileNavItem to='/orders' onClick={closeMobile}>
                  My Orders
                </MobileNavItem>
                <MobileNavItem to='/reservations' onClick={closeMobile}>
                  Reservations
                </MobileNavItem>
                <MobileNavItem to='/cart' onClick={closeMobile}>
                  Cart
                </MobileNavItem>
                <MobileNavItem to='/profile' onClick={closeMobile}>
                  Profile
                </MobileNavItem>

                {user?.role === 'ADMIN' && (
                  <MobileNavItem to='/admin' onClick={closeMobile}>
                    Admin Panel
                  </MobileNavItem>
                )}

                <div className='divider my-1' />

                <button
                  onClick={() => {
                    handleLogout();
                    closeMobile();
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
                <MobileNavItem to='/login' onClick={closeMobile}>
                  Sign in
                </MobileNavItem>
                <div className='px-3 pt-2'>
                  <Link to='/register' className='btn-primary w-full justify-center' onClick={closeMobile}>
                    Reserve a table
                  </Link>
                </div>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};
