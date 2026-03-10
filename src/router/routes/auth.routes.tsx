import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { GuestRoute } from '../guards';

const LoginPage = lazy(() => import('../../features/auth/pages/LoginPage'));
const RegisterPage = lazy(() => import('../../features/auth/pages/RegisterPage'));

export const authRoutes: RouteObject[] = [
  {
    element: <GuestRoute />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
    ],
  },
];
