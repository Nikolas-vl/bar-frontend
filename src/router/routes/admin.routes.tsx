import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { AdminRoute } from '@/router/guards';
import { AdminLayout } from '@/components/layout/admin/AdminLayout';

const DashboardPage = lazy(() => import('@/features/admin/dashboard'));
const UsersPage = lazy(() => import('@/features/admin/users'));
const DishesPage = lazy(() => import('@/features/admin/dishes'));
const OrdersPage = lazy(() => import('@/features/admin/orders'));
const ReservationsPage = lazy(() => import('@/features/admin/reservations'));
const TablesPage = lazy(() => import('@/features/admin/tables'));
const LocationsPage = lazy(() => import('@/features/admin/locations'));
const SettingsPage = lazy(() => import('@/features/admin/settings'));

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
