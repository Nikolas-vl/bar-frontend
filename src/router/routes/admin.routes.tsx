import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { AdminRoute } from '../guards';
import { AdminLayout } from '../../components/layout/AdminLayout';

const DashboardPage = lazy(() => import('../../features/admin/dashboard/pages/DashboardPage'));
const UsersPage = lazy(() => import('../../features/admin/users/pages/UsersPage'));
const DishesPage = lazy(() => import('../../features/admin/dishes/pages/DishesPage'));
const OrdersPage = lazy(() => import('../../features/admin/orders/pages/OrdersPage'));
const ReservationsPage = lazy(() => import('../../features/admin/reservations/pages/ReservationsPage'));
const TablesPage = lazy(() => import('../../features/admin/tables/pages/TablesPage'));
const LocationsPage = lazy(() => import('../../features/admin/locations/pages/LocationsPage'));
const SettingsPage = lazy(() => import('../../features/admin/settings/pages/SettingsPage'));

export const adminRoutes: RouteObject[] = [
  {
    path: '/admin',
    element: <AdminRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: 'users', element: <UsersPage /> },
          { path: 'dishes', element: <DishesPage /> },
          { path: 'orders', element: <OrdersPage /> },
          { path: 'reservations', element: <ReservationsPage /> },
          { path: 'tables', element: <TablesPage /> },
          { path: 'locations', element: <LocationsPage /> },
          { path: 'settings', element: <SettingsPage /> },
        ],
      },
    ],
  },
];
