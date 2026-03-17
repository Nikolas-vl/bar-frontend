import { NavItem } from '@/components/shared/navigation/NavItem';
import { useAuthStore } from '@/store/auth.store';
import { IconHome, IconLogout } from '@/assets/icons';

interface AdminUserFooterProps {
  onLogout: () => void;
  onNavigate?: () => void;
}

export function AdminUserFooter({ onLogout, onNavigate }: AdminUserFooterProps) {
  const user = useAuthStore(s => s.user);

  return (
    <div className='p-3 flex flex-col gap-0.5 shrink-0 border-t border-ob-border'>
      <NavItem to='/' onClick={onNavigate} className='sidebar-link'>
        <IconHome width={16} height={16} />
        Back to Website
      </NavItem>

      {user && (
        <div className='px-3 py-2'>
          <p className='text-xs font-medium truncate text-ob-text'>{user.name ?? user.email}</p>
          <p className='text-xs truncate text-ob-light'>{user.email}</p>
        </div>
      )}

      <button onClick={onLogout} className='sidebar-link w-full text-left text-ob-error'>
        <IconLogout width={16} height={16} />
        Sign out
      </button>
    </div>
  );
}
