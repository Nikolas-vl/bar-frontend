import { Logo } from '../../ui/Logo';
import { AdminNavList } from './AdminNavList';
import { AdminUserFooter } from './AdminUserFooter';

interface AdminSidebarProps {
  onLogout: () => void;
}

export function AdminSidebar({ onLogout }: AdminSidebarProps) {
  return (
    <aside className='hidden lg:flex w-60 flex-col shrink-0 bg-ob-surface border-r border-ob-border'>
      <div className='h-16 flex items-center justify-between px-5 shrink-0 border-b border-ob-border'>
        <Logo size='sm' />
        <span className='px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-[rgba(197,139,90,0.10)] text-ob-caramel'>
          Admin
        </span>
      </div>

      <nav className='flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto'>
        <AdminNavList />
      </nav>

      <AdminUserFooter onLogout={onLogout} />
    </aside>
  );
}
