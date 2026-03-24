import { NavItem } from '@/shared/ui/NavItem';
import { adminNavLinks } from './model/adminNavLinks';

interface AdminNavListProps {
  onNavigate?: () => void;
}

export function AdminNavList({ onNavigate }: AdminNavListProps) {
  return (
    <>
      {adminNavLinks.map(({ to, label, icon: Icon, end }) => (
        <NavItem key={to} to={to} end={end} onClick={onNavigate} className='sidebar-link' activeClassName='sidebar-link-active'>
          <Icon width={16} height={16} />
          {label}
        </NavItem>
      ))}
    </>
  );
}
