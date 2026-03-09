import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { cn } from '../../utils/cn';
import { useAuthStore } from '../../store/auth.store';
import { useUIStore } from '../../store/ui.store';
import { authApi } from '../../api/auth.api';
import { toast } from 'sonner';

const NavItem = ({ to, children }: { to: string; children: React.ReactNode }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      cn('text-sm font-body font-medium transition-colors duration-150', isActive ? 'text-ocean-400' : 'text-slate-400 hover:text-white')
    }
  >
    {children}
  </NavLink>
);

export const Header = () => {
  const { isAuthenticated, user, clearAuth } = useAuthStore();
  const { toggleCart } = useUIStore();
  const navigate = useNavigate();
  const [isMobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } finally {
      clearAuth();
      navigate('/login');
      toast.success('Logged out');
    }
  };

  return (
    <header className='sticky top-0 z-40 border-b border-white/8 bg-dark-900/80 backdrop-blur-md'>
      <div className='page-container'>
        <div className='flex items-center justify-between h-16'>
          {/* Logo */}
          <Link to='/' className='flex items-center gap-2'>
            <span className='font-display text-xl font-semibold text-gradient'>OceanBar</span>
          </Link>

          {/* Desktop nav */}
          <nav className='hidden md:flex items-center gap-6'>
            <NavItem to='/menu'>Menu</NavItem>
            {isAuthenticated && (
              <>
                <NavItem to='/orders'>Orders</NavItem>
                <NavItem to='/reservations'>Reservations</NavItem>
              </>
            )}
            {user?.role === 'ADMIN' && <NavItem to='/admin'>Admin</NavItem>}
          </nav>

          {/* Desktop actions */}
          <div className='hidden md:flex items-center gap-3'>
            {isAuthenticated ? (
              <>
                <button onClick={toggleCart} className='btn-ghost relative'>
                  <CartIcon />
                  <span className='text-sm'>Cart</span>
                </button>
                <Link to='/profile' className='btn-ghost'>
                  <UserIcon />
                  <span className='text-sm'>{user?.name ?? 'Profile'}</span>
                </Link>
                <button onClick={handleLogout} className='btn-secondary text-sm'>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to='/login' className='btn-ghost'>
                  Sign in
                </Link>
                <Link to='/register' className='btn-primary'>
                  Get started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button className='md:hidden btn-ghost p-2' onClick={() => setMobileOpen(v => !v)} aria-label='Toggle menu'>
            {isMobileOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileOpen && (
        <div className='md:hidden border-t border-white/8 bg-dark-800 animate-slide-up'>
          <nav className='page-container py-4 flex flex-col gap-1'>
            <MobileNavItem to='/menu' onClick={() => setMobileOpen(false)}>
              Menu
            </MobileNavItem>
            {isAuthenticated && (
              <>
                <MobileNavItem to='/orders' onClick={() => setMobileOpen(false)}>
                  My Orders
                </MobileNavItem>
                <MobileNavItem to='/reservations' onClick={() => setMobileOpen(false)}>
                  Reservations
                </MobileNavItem>
                <MobileNavItem to='/cart' onClick={() => setMobileOpen(false)}>
                  Cart
                </MobileNavItem>
                <MobileNavItem to='/profile' onClick={() => setMobileOpen(false)}>
                  Profile
                </MobileNavItem>
                {user?.role === 'ADMIN' && (
                  <MobileNavItem to='/admin' onClick={() => setMobileOpen(false)}>
                    Admin Panel
                  </MobileNavItem>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileOpen(false);
                  }}
                  className='text-left px-3 py-2.5 text-sm text-red-400 hover:text-red-300 font-body rounded-lg hover:bg-white/5 transition-colors'
                >
                  Logout
                </button>
              </>
            )}
            {!isAuthenticated && (
              <>
                <MobileNavItem to='/login' onClick={() => setMobileOpen(false)}>
                  Sign in
                </MobileNavItem>
                <MobileNavItem to='/register' onClick={() => setMobileOpen(false)}>
                  Register
                </MobileNavItem>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

const MobileNavItem = ({ to, children, onClick }: { to: string; children: React.ReactNode; onClick?: () => void }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      cn(
        'px-3 py-2.5 text-sm font-body rounded-lg transition-colors',
        isActive ? 'bg-ocean-500/10 text-ocean-400' : 'text-slate-300 hover:text-white hover:bg-white/5',
      )
    }
  >
    {children}
  </NavLink>
);

// Simple inline icons to avoid icon library dependency in phase 1
const CartIcon = () => (
  <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
    <path d='M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z' />
    <line x1='3' y1='6' x2='21' y2='6' />
    <path d='M16 10a4 4 0 01-8 0' />
  </svg>
);

const UserIcon = () => (
  <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
    <path d='M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2' />
    <circle cx='12' cy='7' r='4' />
  </svg>
);

const MenuIcon = () => (
  <svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
    <line x1='3' y1='6' x2='21' y2='6' />
    <line x1='3' y1='12' x2='21' y2='12' />
    <line x1='3' y1='18' x2='21' y2='18' />
  </svg>
);

const CloseIcon = () => (
  <svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
    <line x1='18' y1='6' x2='6' y2='18' />
    <line x1='6' y1='6' x2='18' y2='18' />
  </svg>
);
