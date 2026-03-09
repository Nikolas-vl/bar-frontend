import { createBrowserRouter } from 'react-router-dom';
import { ProtectedRoute, AdminRoute, GuestRoute } from './guards';
import { RootLayout } from '../components/layout/RootLayout';
import { AdminLayout } from '../components/layout/AdminLayout';

// Pages — lazy loaded
import { lazy, Suspense } from 'react';
import { PageLoader } from '../components/ui/PageLoader';
import type { JSX } from 'react/jsx-runtime';

const wrap = (Component: React.LazyExoticComponent<() => JSX.Element>) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
);

// Public
const HomePage = lazy(() => import('../features/menu/pages/HomePage'));
const MenuPage = lazy(() => import('../features/menu/pages/MenuPage'));
const DishPage = lazy(() => import('../features/menu/pages/DishPage'));

// Auth
const LoginPage = lazy(() => import('../features/auth/pages/LoginPage'));
const RegisterPage = lazy(() => import('../features/auth/pages/RegisterPage'));

// Customer
const CartPage = lazy(() => import('../features/cart/pages/CartPage'));
const CheckoutPage = lazy(() => import('../features/orders/pages/CheckoutPage'));
const OrdersPage = lazy(() => import('../features/orders/pages/OrdersPage'));
const OrderDetailPage = lazy(() => import('../features/orders/pages/OrderDetailPage'));
const ReservationsPage = lazy(() => import('../features/reservations/pages/ReservationsPage'));
const NewReservationPage = lazy(() => import('../features/reservations/pages/NewReservationPage'));
const ProfilePage = lazy(() => import('../features/profile/pages/ProfilePage'));
const AddressesPage = lazy(() => import('../features/profile/pages/AddressesPage'));
const PaymentMethodsPage = lazy(() => import('../features/profile/pages/PaymentMethodsPage'));

// Admin
const AdminDashboard = lazy(() => import('../features/admin/dashboard/pages/DashboardPage'));
const AdminUsersPage = lazy(() => import('../features/admin/users/pages/UsersPage'));
const AdminDishesPage = lazy(() => import('../features/admin/dishes/pages/DishesPage'));
const AdminOrdersPage = lazy(() => import('../features/admin/orders/pages/OrdersPage'));
const AdminReservationsPage = lazy(() => import('../features/admin/reservations/pages/ReservationsPage'));
const AdminTablesPage = lazy(() => import('../features/admin/tables/pages/TablesPage'));
const AdminLocationsPage = lazy(() => import('../features/admin/locations/pages/LocationsPage'));
const AdminSettingsPage = lazy(() => import('../features/admin/settings/pages/SettingsPage'));

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      // Public
      { path: '/', element: wrap(HomePage) },
      { path: '/menu', element: wrap(MenuPage) },
      { path: '/menu/:id', element: wrap(DishPage) },

      // Guest only
      {
        element: <GuestRoute />,
        children: [
          { path: '/login', element: wrap(LoginPage) },
          { path: '/register', element: wrap(RegisterPage) },
        ],
      },

      // Protected
      {
        element: <ProtectedRoute />,
        children: [
          { path: '/cart', element: wrap(CartPage) },
          { path: '/checkout', element: wrap(CheckoutPage) },
          { path: '/orders', element: wrap(OrdersPage) },
          { path: '/orders/:id', element: wrap(OrderDetailPage) },
          { path: '/reservations', element: wrap(ReservationsPage) },
          { path: '/reservations/new', element: wrap(NewReservationPage) },
          { path: '/profile', element: wrap(ProfilePage) },
          { path: '/profile/addresses', element: wrap(AddressesPage) },
          { path: '/profile/payments', element: wrap(PaymentMethodsPage) },
        ],
      },
    ],
  },

  // Admin — separate layout
  {
    element: <AdminRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { path: '/admin', element: wrap(AdminDashboard) },
          { path: '/admin/users', element: wrap(AdminUsersPage) },
          { path: '/admin/dishes', element: wrap(AdminDishesPage) },
          { path: '/admin/orders', element: wrap(AdminOrdersPage) },
          { path: '/admin/reservations', element: wrap(AdminReservationsPage) },
          { path: '/admin/tables', element: wrap(AdminTablesPage) },
          { path: '/admin/locations', element: wrap(AdminLocationsPage) },
          { path: '/admin/settings', element: wrap(AdminSettingsPage) },
        ],
      },
    ],
  },
]);
