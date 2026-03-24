import { createBrowserRouter } from 'react-router-dom';
import { lazy } from 'react';
import { RootLayout } from '@/app/layout/RootLayout';

import { publicRoutes } from './routes/public.routes';
import { authRoutes } from './routes/auth.routes';
import { customerRoutes } from './routes/customer.routes';
import { adminRoutes } from './routes/admin.routes';
import { RouteErrorBoundary } from '@/shared/error';

const NotFoundPage = lazy(() => import('../../pages/NotFoundPage'));

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [...publicRoutes, ...authRoutes, ...customerRoutes],
  },
  ...adminRoutes,
  { path: '*', element: <NotFoundPage /> },
]);
