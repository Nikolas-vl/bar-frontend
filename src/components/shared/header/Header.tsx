import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'sonner';
import { useAuthStore } from '../../../store/auth.store';
import { authApi } from '../../../api/auth.api';
import { Logo } from '../../ui/Logo';
import { IconMenu, IconClose } from '../../../assets/icons';
import { DesktopNav } from './DesktopNav';
import { DesktopActions } from './DesktopActions';
import { MobileMenu } from './MobileMenu';

export function Header() {
  const clearAuth = useAuthStore(s => s.clearAuth);
  const navigate = useNavigate();
  const [isMobileOpen, setMobileOpen] = useState(false);

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
          <Link to='/'>
            <Logo size='sm' />
          </Link>

          <DesktopNav />

          <DesktopActions onLogout={handleLogout} />

          {/* Mobile toggle */}
          <button className='md:hidden btn-icon-ghost' onClick={() => setMobileOpen(v => !v)} aria-label='Toggle menu'>
            {isMobileOpen ? <IconClose className='w-5 h-5' /> : <IconMenu className='w-5 h-5' />}
          </button>
        </div>
      </div>

      {isMobileOpen && <MobileMenu onClose={() => setMobileOpen(false)} onLogout={handleLogout} />}
    </header>
  );
}
