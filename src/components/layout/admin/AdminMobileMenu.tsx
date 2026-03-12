import { NavItem } from '../../shared/navigation/NavItem';
import { Logo } from '../../ui/Logo';
import { useAuthStore } from '../../../store/auth.store';
import {
  IconDashboard,
  IconOrders,
  IconReservation,
  IconDishes,
  IconUsers,
  IconTable,
  IconLocation,
  IconSettings,
  IconHome,
  IconLogout,
  IconClose,
} from '../../../assets/icons';

interface AdminMobileMenuProps {
  onClose: () => void;
}

export function AdminMobileMenu({ onClose }: AdminMobileMenuProps) {
  const clearAuth = useAuthStore(s => s.clearAuth);

  return (
    <div className='fixed inset-0 z-50 lg:hidden flex'>
      {/* Backdrop */}
      <div className='absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity' onClick={onClose} />

      {/* Drawer */}
      <div
        className='relative w-72 max-w-[80vw] h-full flex flex-col bg-ob-surface animate-slide-in-left'
        style={{
          backgroundColor: 'var(--color-ob-surface)',
          borderRight: '1px solid var(--color-ob-border)',
        }}
      >
        <div className='h-14 flex items-center justify-between px-4' style={{ borderBottom: '1px solid var(--color-ob-border)' }}>
          <Logo size='sm' />
          <button onClick={onClose} className='btn-icon-ghost'>
            <IconClose width={20} height={20} />
          </button>
        </div>

        <nav className='flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto'>
          <NavItem to='/admin' end onClick={onClose} className='sidebar-link' activeClassName='sidebar-link-active'>
            <IconDashboard width={16} height={16} />
            Dashboard
          </NavItem>

          <NavItem to='/admin/orders' onClick={onClose} className='sidebar-link' activeClassName='sidebar-link-active'>
            <IconOrders width={16} height={16} />
            Orders
          </NavItem>

          <NavItem to='/admin/reservations' onClick={onClose} className='sidebar-link' activeClassName='sidebar-link-active'>
            <IconReservation width={16} height={16} />
            Reservations
          </NavItem>

          <NavItem to='/admin/dishes' onClick={onClose} className='sidebar-link' activeClassName='sidebar-link-active'>
            <IconDishes width={16} height={16} />
            Dishes
          </NavItem>

          <NavItem to='/admin/users' onClick={onClose} className='sidebar-link' activeClassName='sidebar-link-active'>
            <IconUsers width={16} height={16} />
            Users
          </NavItem>

          <NavItem to='/admin/tables' onClick={onClose} className='sidebar-link' activeClassName='sidebar-link-active'>
            <IconTable width={16} height={16} />
            Tables
          </NavItem>

          <NavItem to='/admin/locations' onClick={onClose} className='sidebar-link' activeClassName='sidebar-link-active'>
            <IconLocation width={16} height={16} />
            Locations
          </NavItem>

          <NavItem to='/admin/settings' onClick={onClose} className='sidebar-link' activeClassName='sidebar-link-active'>
            <IconSettings width={16} height={16} />
            Settings
          </NavItem>
        </nav>

        <div className='p-3 flex flex-col gap-0.5 shrink-0 bg-ob-surface' style={{ borderTop: '1px solid var(--color-ob-border)' }}>
          <NavItem to='/' onClick={onClose} className='sidebar-link'>
            <IconHome width={16} height={16} />
            Back to Website
          </NavItem>

          <button
            onClick={() => {
              clearAuth();
              onClose();
            }}
            className='sidebar-link w-full text-left'
            style={{ color: 'var(--color-ob-error)' }}
          >
            <IconLogout width={16} height={16} />
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
