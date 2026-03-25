import { IconDashboard, IconOrders, IconReservation, IconDishes, IconUsers, IconTable, IconLocation, IconSettings } from '@/shared/assets/icons';


export const ADMIN_NAV_LINKS = [
  { to: '/admin', label: 'Dashboard', icon: IconDashboard, end: true },
  { to: '/admin/orders', label: 'Orders', icon: IconOrders },
  { to: '/admin/reservations', label: 'Reservations', icon: IconReservation },
  { to: '/admin/dishes', label: 'Dishes', icon: IconDishes },
  { to: '/admin/users', label: 'Users', icon: IconUsers },
  { to: '/admin/tables', label: 'Tables', icon: IconTable },
  { to: '/admin/locations', label: 'Locations', icon: IconLocation },
  { to: '/admin/settings', label: 'Settings', icon: IconSettings },
];
