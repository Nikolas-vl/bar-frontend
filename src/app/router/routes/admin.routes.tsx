import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { AdminRoute } from '@/app/router/guards';
import { AdminLayout } from '@/app/layout/admin/AdminLayout';

const DashboardPage = lazy(() => import('@/admin/features/dashboard'));
const UsersPage = lazy(() => import('@/admin/features/users'));
const DishesPage = lazy(() => import('@/admin/features/dishes'));
const OrdersPage = lazy(() => import('@/admin/features/orders'));
const ReservationsPage = lazy(() => import('@/admin/features/reservations'));
const TablesPage = lazy(() => import('@/admin/features/tables'));
const LocationsPage = lazy(() => import('@/admin/features/locations'));
const SettingsPage = lazy(() => import('@/admin/features/settings'));

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
