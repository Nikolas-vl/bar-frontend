import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useLogout } from '@/hooks/useLogout';
import { Logo } from '@/components/shared/ui';
import { IconMenu, IconClose } from '@/assets/icons';
import { DesktopNav } from './DesktopNav';
import { DesktopActions } from './DesktopActions';
import { MobileMenu } from './MobileMenu';

export function Header() {
  const handleLogout = useLogout();
  const [isMobileOpen, setMobileOpen] = useState(false);

  return (
    <header className='sticky top-0 z-40 bg-ob-bg border-b border-ob-border shadow-[0_1px_8px_rgba(47,47,47,0.05)]'>
      <div className='page-container'>
        <div className='flex items-center justify-between h-16'>
          <Link to='/'>
            <Logo size='sm' />
          </Link>

          <DesktopNav />

          <DesktopActions onLogout={handleLogout} />

          <button className='md:hidden btn-icon-ghost' onClick={() => setMobileOpen(v => !v)} aria-label='Toggle menu'>
            {isMobileOpen ? <IconClose className='w-5 h-5' /> : <IconMenu className='w-5 h-5' />}
          </button>
        </div>
      </div>

      {isMobileOpen && <MobileMenu onClose={() => setMobileOpen(false)} onLogout={handleLogout} />}
    </header>
  );
}
