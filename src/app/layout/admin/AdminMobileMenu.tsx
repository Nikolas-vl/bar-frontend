import { Logo } from '@/shared/ui';
import { IconClose } from '@/shared/assets/icons';
import { AdminNavList } from './AdminNavList';
import { AdminUserFooter } from './AdminUserFooter';
import { Link } from 'react-router-dom';

interface AdminMobileMenuProps {
  onClose: () => void;
  onLogout: () => void;
}

export function AdminMobileMenu({ onClose, onLogout }: AdminMobileMenuProps) {
  return (
    <div className='fixed inset-0 z-50 lg:hidden flex'>
      <div className='absolute inset-0 bg-black/40' onClick={onClose} />

      <div className='relative w-72 max-w-[80vw] h-full flex flex-col bg-ob-surface border-r border-ob-border animate-slide-in-right'>
        <div className='h-16 flex items-center justify-between px-4 shrink-0 border-b border-ob-border'>
          <Link to='/'>
            <Logo size='sm' />
          </Link>

          <button onClick={onClose} className='btn-icon-ghost' aria-label='Close menu'>
            <IconClose width={20} height={20} />
          </button>
        </div>

        <nav className='flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto'>
          <AdminNavList onNavigate={onClose} />
        </nav>

        <AdminUserFooter onLogout={onLogout} onNavigate={onClose} />
      </div>
    </div>
  );
}
