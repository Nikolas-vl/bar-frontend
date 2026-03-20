import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { ProtectedRoute } from '@/router/guards';

const CartPage = lazy(() => import('@/features/cart'));
const CheckoutPage = lazy(() => import('@/features/orders/pages/CheckoutPage'));
const OrdersPage = lazy(() => import('@/features/orders'));
const OrderDetailPage = lazy(() => import('@/features/orders/pages/OrderDetailPage'));
const ReservationsPage = lazy(() => import('@/features/reservations'));
const NewReservationPage = lazy(() => import('@/features/reservations/pages/NewReservationPage'));
const ProfilePage = lazy(() => import('@/features/profile'));
const AddressesPage = lazy(() => import('@/features/addresses/pages/AddressesPage'));
const PaymentMethodsPage = lazy(() => import('@/features/payments/pages/PaymentMethodsPage'));

export const customerRoutes: RouteObject[] = [
  {
    element: <ProtectedRoute />,
    children: [
      { path: '/cart', element: <CartPage /> },
      { path: '/checkout', element: <CheckoutPage /> },
      { path: '/orders', element: <OrdersPage /> },
      { path: '/orders/:id', element: <OrderDetailPage /> },
      { path: '/reservations', element: <ReservationsPage /> },
      { path: '/reservations/new', element: <NewReservationPage /> },
      { path: '/profile', element: <ProfilePage /> },
      { path: '/profile/addresses', element: <AddressesPage /> },
      { path: '/profile/payments', element: <PaymentMethodsPage /> },
    ],
  },
];
