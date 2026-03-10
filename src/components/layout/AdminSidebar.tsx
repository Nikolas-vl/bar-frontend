import { NavItem } from '../shared/navigation/NavItem';
import { Logo } from '../ui/Logo';

import { IconDashboard, IconOrders, IconReservation, IconDishes, IconUsers, IconTable, IconLocation, IconSettings } from '../../assets/icons';

export function AdminSidebar() {
  return (
    <aside
      className='hidden lg:flex w-60 flex-col shrink-0'
      style={{
        backgroundColor: 'var(--color-ob-surface)',
        borderRight: '1px solid var(--color-ob-border)',
      }}
    >
      <div className='h-16 flex items-center justify-between px-5' style={{ borderBottom: '1px solid var(--color-ob-border)' }}>
        <Logo size='sm' />

        <span
          className='px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider'
          style={{
            background: 'rgba(197,139,90,0.10)',
            color: 'var(--color-ob-caramel)',
          }}
        >
          Admin
        </span>
      </div>

      <nav className='flex-1 px-3 py-4 flex flex-col gap-0.5'>
        <NavItem to='/admin' end className='sidebar-link' activeClassName='sidebar-link-active'>
          <IconDashboard width={16} height={16} />
          Dashboard
        </NavItem>

        <NavItem to='/admin/orders' className='sidebar-link' activeClassName='sidebar-link-active'>
          <IconOrders width={16} height={16} />
          Orders
        </NavItem>

        <NavItem to='/admin/reservations' className='sidebar-link' activeClassName='sidebar-link-active'>
          <IconReservation width={16} height={16} />
          Reservations
        </NavItem>

        <NavItem to='/admin/dishes' className='sidebar-link' activeClassName='sidebar-link-active'>
          <IconDishes width={16} height={16} />
          Dishes
        </NavItem>

        <NavItem to='/admin/users' className='sidebar-link' activeClassName='sidebar-link-active'>
          <IconUsers width={16} height={16} />
          Users
        </NavItem>

        <NavItem to='/admin/tables' className='sidebar-link' activeClassName='sidebar-link-active'>
          <IconTable width={16} height={16} />
          Tables
        </NavItem>

        <NavItem to='/admin/locations' className='sidebar-link' activeClassName='sidebar-link-active'>
          <IconLocation width={16} height={16} />
          Locations
        </NavItem>

        <NavItem to='/admin/settings' className='sidebar-link' activeClassName='sidebar-link-active'>
          <IconSettings width={16} height={16} />
          Settings
        </NavItem>
      </nav>
    </aside>
  );
}
